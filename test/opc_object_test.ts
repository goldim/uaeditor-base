import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';
import { OpcVariable } from "../src/opc_variable";

import { OpcObject } from "../src/opc_object";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';
import { IComposite } from '../src/icomponent';
import { NullComponent } from '../src/null_component';

@suite class OpcObjectTest {
  private obj: OpcObject;

  before() {
      this.obj = new OpcObject('test1');
  }

  @test 'before save' (){
    assert.isFalse(this.obj.wasSaved());
  }

  @test 'save' (){
    this.obj.save();

    assert.isTrue(this.obj.wasSaved());
  }

  @test 'isModified' (){
    assert.isFalse(this.obj.isModified());
  }

  @test 'isModified changeId' (){
    this.obj.Id = "test";

    assert.isTrue(this.obj.isModified());
  }

  @test 'isModified save' (){
    this.obj.Id = "test";

    this.obj.save();

    assert.isFalse(this.obj.isModified());
  }

  @test 'toString method' (){
    expect(this.obj.toString()).to.be.equal('opcobj');
  }

  @test 'add component' (){
    this.addObject('test2');

    assert.isTrue(this.obj.isModified());
    assert.isTrue(this.obj.hasChild('test2'));
  }

  private addComponentToSecondLvl(component: IComposite): void {
    const childObj = new OpcObject('test2');
    this.addComponentToComponent(childObj, this.obj);
    this.addComponentToComponent(component, childObj);
  }

  @test 'getChild object' (){
    this.addComponentToSecondLvl(new OpcObject('test3'));

    const searchedObject = this.obj.getChild('test3');
    
    expect(searchedObject.Id).to.be.equal('test3');
  }

  @test 'getChild variable' (){
    this.addComponentToSecondLvl(new OpcVariable('var1'));

    const searchedVariable = this.obj.getChild('var1');
    
    expect(searchedVariable.Id).to.be.equal('var1');
  }

  @test 'getChild no child' (){
    this.addComponentToSecondLvl(new OpcVariable('var1'));

    const searchedVariable = this.obj.getChild('var3');
    
    expect(searchedVariable).instanceOf(NullComponent);
  }

  @test 'hasChild' (){
    this.addObject('test2');
    
    const result = this.obj.hasChild('test2');
    
    assert.isTrue(result);
  }

  @test 'remove component' (){
    this.addObject('test2');

    this.obj.remove('test2');

    assert.isTrue(this.obj.isModified());
    assert.isFalse(this.obj.hasChild('test2'));
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.obj.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.obj.addProperty('port', '80');

    assert.isTrue(this.obj.hasProperty('port'));
  }

  @test 'build' (){
    this.obj.addProperty('port', '80');
    this.addComponentToComponent(new OpcVariable('test'), this.obj);
    this.addComponentToComponent(new OpcObject('obj1'), this.obj);
    const builder = new Builder(new XmlSerializer());

    this.obj.build(builder)

    const expected = '<obj id="test1"><options><port>80</port></options><var id="test"><options></options></var><obj id="obj1"><options></options></obj></obj>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const loader = new Loader('<obj id="Room1"><options><color>green</color></options><obj id="Chair1"><options><color>blue</color></options></obj></obj>', new XmlDeserializer());

    this.obj.load(loader);

    assert.isFalse(this.obj.isModified());
    expect(this.obj.Id).to.be.equal('Room1');
    expect(this.obj.getProperty('color').Value).to.be.equal('green');
    assert.isTrue(this.obj.hasChild('Chair1'));
  }

  private addComponentToComponent(what: IComposite, where: IComposite){
    where.add(what);
  }

  private addObject(id: string){
    this.addComponentToComponent(new OpcObject(id), this.obj);
  }
}