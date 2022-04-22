import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Binding } from "../src/binding";
import { Direction } from '../src/ibindable';
import { XmlSerializer } from '../src/xml_serializer';
import { Builder } from '../src/builder';

@suite class BindingTest {
  @test 'construct' (){
    const b = new Binding('b1', Direction.In);

    expect(b.Id).to.be.equal('b1');
    expect(b.Direction).to.be.equal(Direction.In);
  }

  @test 'build' (){
    const builder = new Builder(new XmlSerializer());
    const b = new Binding('b1', Direction.In);

    b.build(builder);

    expect(builder.getResult()).to.be.equal('<bindTo id="b1" direction="in"/>');
  }
}