import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Plugin } from "../src/plugin";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';

@suite class PluginTest {
  private plugin: Plugin;

  before() {
      this.plugin = new Plugin('History');
  }

  @test 'save' (){
    assert.isFalse(this.plugin.wasSaved());

    this.plugin.save();

    assert.isTrue(this.plugin.wasSaved());
  }

  @test 'toString method' (){
    expect(this.plugin.toString()).to.be.equal('plugin');
  }

  @test 'isModified' (){
    assert.isFalse(this.plugin.isModified());
  }


  @test 'isModified changeId' (){
    this.plugin.Id = "test";

    assert.isTrue(this.plugin.isModified());
  }

  @test 'isModified save' (){
    this.plugin.Id = "test";

    this.plugin.save();

    assert.isFalse(this.plugin.isModified());
  }

  @test 'hasProperty no property' (){
    assert.isFalse(this.plugin.hasProperty("ip"));
  }

  @test 'addProperty' (){
    this.plugin.addProperty('port', '80');

    assert.isTrue(this.plugin.hasProperty('port'));
  }

  @test 'build' (){
    this.plugin.addProperty('maxValuesPerRequest', '500');
    const builder = new Builder(new XmlSerializer());

    this.plugin.build(builder)

    const expected = '<plugin id="History"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const loader = new Loader('<plugin id="History"><options><maxValuesPerRequest>500</maxValuesPerRequest></options></plugin>', new XmlDeserializer());

    this.plugin.load(loader);

    expect(this.plugin.Id).to.be.equal('History');
    expect(this.plugin.getProperty('maxValuesPerRequest').Value).to.be.equal('500');
  }
}