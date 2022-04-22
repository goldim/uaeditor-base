import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { PropertyGroup } from "../src/property_group";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { XmlDeserializer } from '../src/xml_deserializer';
import { Loader } from '../src/loader';

@suite class PropertyGroupTest {
  private grp: PropertyGroup;

  before() {
      this.grp = new PropertyGroup('test1');
  }

  @test 'save' (){
    assert.isFalse(this.grp.wasSaved());

    this.grp.save();

    assert.isTrue(this.grp.wasSaved());
  }

  @test 'isModified' (){
    assert.isFalse(this.grp.isModified());
  }


  @test 'isModified change name' (){
    this.grp.Name = "test";

    assert.isTrue(this.grp.isModified());
  }

  @test 'isModified save' (){
    this.grp.Name = "test2";

    this.grp.save();

    assert.isFalse(this.grp.isModified());
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.grp.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.grp.addProperty('port', '80');

    assert.isTrue(this.grp.hasProperty('port'));
  }

  @test 'build' (){
    this.grp.addProperty('port', '80');
    const builder = new Builder(new XmlSerializer());

    this.grp.build(builder)

    const expected = '<test1><options><port>80</port></options></test1>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const loader = new Loader('<settings><options><port>8080</port><ip>localhost</ip></options></settings>', new XmlDeserializer());

    this.grp.load(loader);

    expect(this.grp.Name).to.be.equal('settings');
    expect(this.grp.getProperties()).to.have.length(2);
  }
}