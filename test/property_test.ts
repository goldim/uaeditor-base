import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Property} from "../src/property";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';

@suite class PropertyTest {
  private prop: Property;
  private NAME = "port";
  private VALUE = "80";

  before(){
    this.prop = new Property(this.NAME, this.VALUE);
  }

  @test 'construct' (){
    expect(this.prop.Name).to.be.equal(this.NAME);
    expect(this.prop.Value).to.be.equal(this.VALUE);
    assert.isFalse(this.prop.Required);
    assert.isFalse(this.prop.wasSaved());
  }

  @test 'save' (){
    this.prop.save();

    assert.isTrue(this.prop.wasSaved());
  }

  @test 'isModified' (){
    assert.isFalse(this.prop.isModified());
  }

  @test 'isModified change value' (){
    this.prop.Value = "8080";

    assert.isTrue(this.prop.isModified());
  }

  @test 'isModified after save' (){
    this.prop.Value = "8080";
    this.prop.save();

    assert.isFalse(this.prop.isModified());
  }

  @test 'build' (){
    this.prop.Value = "8080";
    const builder = new Builder(new XmlSerializer());

    this.prop.build(builder);

    expect(builder.getResult()).to.be.equal("<port>8080</port>");
  }

  @test 'load' (){
    const loader = new Loader('<port>8080</port>', new XmlDeserializer());

    this.prop.load(loader);

    expect(this.prop.Name).to.be.equal('port');
    expect(this.prop.Value).to.be.equal('8080');
  }
}
