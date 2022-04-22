import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Config } from "../src/config";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { IDeserializer, XmlDeserializer } from '../src/xml_deserializer';
import { Plugin } from '../src/plugin';
import { OpcObject } from '../src/opc_object';
import { NullComponent } from '../src/null_component';
import { IComposite } from '../src/icomponent';

@suite class ConfigTest {
  private cfg: Config;

  before() {
    this.cfg = new Config();
  }

  @test 'wasSaved' (){
    assert.isFalse(this.cfg.wasSaved());
  }

  @test 'save' (){
    this.cfg.getUsers().addUser("root", "1234");

    this.cfg.save();

    assert.isTrue(this.cfg.wasSaved());
  }

  @test 'isModified' (){
    assert.isFalse(this.cfg.isModified());
  }

  @test 'isModified add user' (){
    this.cfg.getUsers().addUser("root", "1234");

    assert.isTrue(this.cfg.isModified());
  }

  @test 'add' (){
    this.cfg.add(new Plugin('plugin1'));

    assert.isTrue(this.cfg.isModified());
    assert.isTrue(this.cfg.hasChild('plugin1'));
  }

  @test 'remove' (){
    this.cfg.add(new Plugin('plugin1'));

    this.cfg.remove('plugin1');

    assert.isTrue(this.cfg.isModified());
    assert.isFalse(this.cfg.hasChild('plugin1'));
  }

  @test 'build' (){
    const builder = new Builder(new XmlSerializer());

    const expected = '<?xml version="1.0"?><project><server><users></users></server><plugins></plugins><opc></opc></project>';
    this.cfg.build(builder)
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'getChild two level wrong path' (){
    this.makeConfigStructure('obj1', 'obj2');
    
    const found = this.cfg.getChild('obj3/obj2');
    
    expect(found).instanceOf(NullComponent);
  }

  @test 'getChild tree level wrong path' (){
    this.makeConfigStructure('obj1', 'obj2', 'obj3');
    
    const found = this.cfg.getChild('obj1/obj4/obj3');
    
    expect(found).instanceOf(NullComponent);
  }

  @test 'getChild' (){
    this.makeConfigStructure('obj1', 'obj2', 'obj3');
    
    const found = this.cfg.getChild('obj1/obj2/obj3');
    
    expect(found.Id).equals('obj3');
  }

  @test 'toString method' (){
    expect(this.cfg.toString()).to.be.equal('root');
  }

  private makeConfigStructure(...ids: string[]){
    let currentObj: IComposite = this.cfg;
    for (const id of ids){
      const obj = new OpcObject(id);
      currentObj.add(obj);
      currentObj = obj;
    }
  }
}

@suite class ConfigLoadTest {
  private cfg: Config;
  private serializer: IDeserializer;

  before() {
    this.cfg = new Config();
    this.serializer = new XmlDeserializer();
  }

  private loadCfg(content: string): void {
    const loader = new Loader(content, this.serializer);
    this.cfg.load(loader);
  }

  @test 'load users' (){
    const content = '<project><server><users><user login="root" passwd="1234"/></users></server><plugins></plugins><opc></opc></project>';
    const loader = new Loader(content, this.serializer);

    this.cfg.load(loader);

    expect(this.cfg.getUsers().Count).to.be.equal(1);
  }

  @test 'load groups' (){
    const groups = '<group1><options><option1>value1</option1></options></group1><group2><options><option2>value2</option2></options></group2>'
    const content = `<project><server>${groups}<users></users></server><opc></opc><plugins></plugins></project>`;

    this.loadCfg(content);

    const property1 = this.cfg.getPropertyGroup('group1').getProperty('option1');
    expect(property1.Value).to.be.equal('value1');
    const property2 = this.cfg.getPropertyGroup('group2').getProperty('option2');
    expect(property2.Value).to.be.equal('value2');
  }

  @test 'getChild object' (){
    const content = '<project><server><users></users></server><opc><obj id="myObj"><options><port>8080</port></options></obj></opc><plugins></plugins></project>';
    this.loadCfg(content);

    const obj = this.cfg.getChild('myObj');
    
    expect(obj.getProperty('port').Value).to.be.equal('8080');
  }

  @test 'getChild variable' (){
    const content = '<project><server><users></users></server><opc><var id="myVar"><options><port>8080</port></options></var></opc><plugins></plugins></project>';
    this.loadCfg(content);

    const foundVariable = this.cfg.getChild('myVar');
    
    expect(foundVariable.getProperty('port').Value).to.be.equal('8080');
  }

  @test 'getChild' (){
    const options = '<options></options>';
    const opc = `<opc><obj id="obj1">${options}<obj id="obj2">${options}</obj></obj></opc>`;
    this.loadCfg(`<project><server><users></users></server>${opc}<plugins></plugins></project>`);

    const res = this.cfg.getChild('obj1/obj2');

    expect(res.Id).to.be.equal('obj2');
  }
}