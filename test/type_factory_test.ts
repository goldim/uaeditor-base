import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { TypeFactory } from "../src/type_factory";
import { OpcObject } from '../src/opc_object';
import { OpcVariable } from '../src/opc_variable';
import { Plugin } from '../src/plugin';

@suite class TypeFactoryTest {
  @test 'getTypeInstance' () {
    expect(TypeFactory.getTypeInstance("opcobj")).instanceOf(OpcObject);
    expect(TypeFactory.getTypeInstance("opcvar")).instanceOf(OpcVariable);
    expect(TypeFactory.getTypeInstance("plugin")).instanceOf(Plugin);
  }

  @test 'getTypeInstance no type by name' () {
    expect(TypeFactory.getTypeInstance("deviceA")).instanceOf(OpcObject);
  }

  @test 'getType' () {
    const type = TypeFactory.getType("opcobj");

    expect(type.Name).equals("opcobj");
  }
}