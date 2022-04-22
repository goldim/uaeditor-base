import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Alarm } from "../src/alarm";
import { Field } from "../src/alarm_field";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';

@suite class AlarmTest {
  private alarm: Alarm;

  before() {
      this.alarm = new Alarm('alarm1');
  }

  @test 'save' (){
    this.alarm.save();

    assert.isFalse(this.alarm.isModified());
    assert.isTrue(this.alarm.wasSaved());
  }

  @test 'save change property value' (){
    this.alarm.addProperty('port', '80');
    this.alarm.save();

    const prop = this.alarm.getProperty('port');
    prop.Value = '8080';
    this.alarm.save();

    assert.isTrue(this.alarm.wasSaved());
  }

  @test 'isModified' () {
    assert.isFalse(this.alarm.isModified());
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.alarm.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.alarm.addProperty('port', '80');

    assert.isTrue(this.alarm.hasProperty('port'));
  }

  @test 'build' (){
    this.alarm.addProperty('type', 'Base');
    this.addField('severity');
    const builder = new Builder(new XmlSerializer());

    this.alarm.build(builder)

    const expected = '<alarm id="alarm1"><options><type>Base</type></options><field id="severity"></field></alarm>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const fields = '<field id="Severity"><options></options></field>';
    const options = '<options><type>Base</type></options>';
    const content = `<alarm id="alarm1">${options}${fields}</alarm>`;
    const loader = new Loader(content, new XmlDeserializer());

    this.alarm.load(loader);

    assert.isFalse(this.alarm.isModified());
    expect(this.alarm.Id).to.be.equal('alarm1');
    expect(this.alarm.getProperty('type').Value).to.be.equal('Base');
  }

  @test 'add field' (){
    this.addField('field1');

    assert.isTrue(this.alarm.isModified());
    assert.isTrue(this.alarm.hasChild('field1'));
  }

  @test 'remove field' (){
    this.addField('field1');
    this.alarm.save();

    this.alarm.remove('field1');

    assert.isTrue(this.alarm.isModified());
    assert.isFalse(this.alarm.hasChild('field1'));
  }

  @test 'toString method' (){
    expect(this.alarm.toString()).to.be.equal('alarm');
  }

  private addField(id: string): void {
    const field = new Field(id);
    this.alarm.add(field);
  }
}
