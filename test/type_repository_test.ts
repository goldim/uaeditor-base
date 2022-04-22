import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Type } from "../src/type";
import { TypeRepository } from "../src/type_repository";

@suite class TypeRepositoryTest {
  private repository: TypeRepository;

  before(){
    this.repository = new TypeRepository();
  }

  @test 'add Type' () {
    this.repository.add(new Type('mytype'));

    assert.isTrue(this.repository.hasType('mytype'));
  }

  @test 'hasType no types' () {
    assert.isFalse(this.repository.hasType('mytype'));
  }

  @test 'getType no types' () {
    const found = this.repository.getType('mytype');

    assert.isNull(found);
  }

  @test 'getType' () {
    this.repository.add(new Type('mytype'));

    const found = this.repository.getType('mytype');

    assert.isNotNull(found);
  }

  @test 'load' () {
    this.repository.load();

    assert.isTrue(this.repository.hasType('opcvar'));
    assert.isTrue(this.repository.hasType('opcobj'));
    assert.isTrue(this.repository.hasType('plugin'));
  }
}