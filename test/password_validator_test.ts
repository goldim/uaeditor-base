import * as _chai from 'chai';
import { expect } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { PasswordValidator } from "../src/password_validator";

@suite class PasswordValidatorTest {
  @test 'validate password' () {
    const password = "1234";

    const valid = PasswordValidator.validate(password);

    expect(valid).to.be.true;
  }

  @test 'validate bad password' () {
    const password = "";

    const valid = PasswordValidator.validate(password);

    expect(valid).to.be.false;
  }
}