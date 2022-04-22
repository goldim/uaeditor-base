import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { OpcVariable } from "../src/opc_variable";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';
import { Direction } from '../src/ibindable';

@suite class OpcVariableTest {
  private variable: OpcVariable;

  before() {
    this.variable = new OpcVariable("test");
  }

  @test 'setValue' () {
    const VALUE = 1;

    this.variable.Value = VALUE;

    expect(this.variable.Value).to.be.equal(VALUE)
  }

  @test 'hasBindings no bindings' (){
    assert.isFalse(this.variable.wasBound());
  }

  @test 'bindTo' (){
    const secondVar = new OpcVariable("test2");

    this.variable.bindTo(secondVar, Direction.In);

    assert.isTrue(this.variable.wasBoundTo(secondVar));
    assert.isTrue(secondVar.wasBoundTo(this.variable));
    assert.isTrue(this.variable.wasBound());
    assert.isTrue(secondVar.wasBound());
    assert.isTrue(this.variable.isModified());
    assert.isTrue(secondVar.isModified());
  }

  @test 'bindTo both in direction' (){
    const secondVar = new OpcVariable("test2");

    this.variable.bindTo(secondVar, Direction.In);
    secondVar.bindTo(this.variable, Direction.In);

    expect(this.variable.getInBindings()).contains('test2');
    expect(this.variable.getOutBindings()).contains('test2');
    expect(secondVar.getInBindings()).contains('test');
    expect(secondVar.getOutBindings()).contains('test');
  }

  @test 'bindTo twice' (){
    const secondVar = new OpcVariable("test2");
    this.variable.bindTo(secondVar, Direction.In);
    this.variable.save();
    secondVar.save();

    this.variable.bindTo(secondVar, Direction.In);

    assert.isFalse(this.variable.isModified());
    assert.isFalse(secondVar.isModified());
  }

  @test 'unbindWith' (){
    const secondVar = new OpcVariable("test2");
    this.variable.bindTo(secondVar, Direction.In);
    this.variable.save();
    secondVar.save();

    this.variable.unbindWith(secondVar);

    assert.isFalse(this.variable.wasBoundTo(secondVar));
    assert.isFalse(secondVar.wasBoundTo(this.variable));
    assert.isFalse(this.variable.wasBound());
    assert.isFalse(secondVar.wasBound());
    assert.isTrue(this.variable.isModified());
    assert.isTrue(secondVar.isModified());
  }

  @test 'unbindWith unbound' (){
    const secondVar = new OpcVariable("test2");

    const testFunc = () => this.variable.unbindWith(secondVar);
    expect(testFunc).to.not.throw();
  }

  @test 'save' (){
    assert.isFalse(this.variable.wasSaved());

    this.variable.save();

    assert.isTrue(this.variable.wasSaved());
  }

  @test 'isModified' (){
    assert.isFalse(this.variable.isModified());
  }

  @test 'toString method' (){
    expect(this.variable.toString()).to.be.equal('opcvar');
  }

  @test 'isModified changeId' (){
    this.variable.Id = "myId";

    assert.isTrue(this.variable.isModified());
  }

  @test 'isModified save' (){
    this.variable.Id = "myId";

    this.variable.save();

    assert.isFalse(this.variable.isModified());
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.variable.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.variable.addProperty('port', '80');

    assert.isTrue(this.variable.hasProperty('port'));
  }

  @test 'build' (){
    this.variable.addProperty('port', '80');
    const secondVar = new OpcVariable("test2");
    this.variable.bindTo(secondVar, Direction.In);
    const builder = new Builder(new XmlSerializer());

    this.variable.build(builder);
    expect(builder.getResult()).to.be.equal('<var id="test"><options><port>80</port></options><bindTo id="test2" direction="in"/></var>');
  }

  @test 'load' (){
    const loader = new Loader('<var id="port"><options><defaultValue>8080</defaultValue></options><bindTo id="comPort"/></var>', new XmlDeserializer());

    this.variable.load(loader);

    assert.isFalse(this.variable.isModified());
    expect(this.variable.Id).to.be.equal('port');
    assert.isTrue(this.variable.wasBound());
    expect(this.variable.getProperty('defaultValue').Value).to.be.equal('8080');
  }
}