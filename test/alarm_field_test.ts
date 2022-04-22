import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Field } from "../src/alarm_field";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { ILoader, Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';
import { Direction } from '../src/ibindable';
import { OpcVariable } from '../src/opc_variable';

@suite class AlarmFieldTest {
  private field: Field;

  before() {
      this.field = new Field('field1');
  }

  @test 'save' (){
    this.field.save();

    assert.isFalse(this.field.isModified());
    assert.isTrue(this.field.wasSaved());
  }

  @test 'isModified' () {
    assert.isFalse(this.field.isModified());
  }

  @test 'build' (){
    const builder = new Builder(new XmlSerializer());

    this.field.build(builder)

    const expected = '<field id="field1"></field>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'build field bound to variable ' (){
    const builder = new Builder(new XmlSerializer());

    this.field.build(builder)

    const expected = '<field id="field1"></field>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'bindTo other field' (){
    const field2 = new Field('field2');

    const testFunc = () => this.field.bindTo(field2, Direction.In);

    expect(testFunc).to.throw();
  }

  @test 'bindTo variable with OUT direction' (){
    const field2 = new OpcVariable('field2');

    const testFunc = () => this.field.bindTo(field2, Direction.Out);

    expect(testFunc).to.throw();
  }

  @test 'bindTo check modify when already bound' (){
    const field2 = new OpcVariable('field2');
    this.field.bindTo(field2, Direction.In);
    this.field.save();

    this.field.bindTo(field2, Direction.In);

    assert.isFalse(this.field.isModified());
  }

  @test 'bindTo variable with IN direction' (){
    const field2 = new OpcVariable('field2');

    this.field.bindTo(field2, Direction.In);

    expect(this.field.wasBoundTo(field2)).to.be.true;
  }

  @test 'isModified load' (){
    const loader = this.createLoader('<field id="field1"><options></options></field>');

    this.field.load(loader);

    assert.isFalse(this.field.isModified());
  }

  @test 'load' (){
    const loader = this.createLoader('<field id="field1"><bindTo id="var1" direction="in"/></field>');

    this.field.load(loader);
    
    expect(this.field.Id).to.be.equal('field1');
    expect(this.field.wasBound()).to.be.true;
  }

  @test 'load wrong direction' (){
    const loader = this.createLoader('<field id="Severity"><bindTo id="var1" direction="out"/></field>');

    const testFunc = () => this.field.load(loader);

    expect(testFunc).to.throw();
  }

  @test 'toString method' (){
    expect(this.field.toString()).to.be.equal('field');
  }

  @test 'addProperty' (){
    const testFunc = () => this.field.addProperty('port', '8080');

    expect(testFunc).to.throw();
  }

  private createLoader(content: string): ILoader {
    return new Loader(content, new XmlDeserializer());
  }
}
