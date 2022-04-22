import * as _chai from 'chai';
import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { PresenterRegistry } from '../src/presenter_registry';

@suite class PresenterRegistryTest {
  @test 'construct' () {
    const presenter = PresenterRegistry.getPresenter("script");

    expect(presenter).to.not.be.null;
  }
}