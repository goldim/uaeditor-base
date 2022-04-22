import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { Users } from "../src/users";
import { Builder } from '../src/builder';
import { XmlSerializer } from '../src/xml_serializer';
import { Loader } from '../src/loader';
import { XmlDeserializer } from '../src/xml_deserializer';

@suite class UsersTest {
  private users: Users;

  before(){
    this.users = new Users();
  }

  @test 'addUser' () {
    const login = "testLogin";
    const password = "1234";

    this.users.addUser(login, password);

    expect(this.users.Count).to.be.equal(1);
  }

  @test 'addUser the same login twice' (){
    const name = 'root';
    const password = '1234';

    this.users.addUser(name, password);
    this.users.addUser(name, password);

    expect(this.users.Count).equals(1);
  }

  @test 'addUser empty login' (){
    const name = '';
    const password = '1234';

    this.users.addUser(name, password);

    expect(this.users.Count).equals(0);
  }

  @test 'getLogins 0 users' () {
    const logins = this.users.getLogins();

    expect(logins).to.have.lengthOf(0);
  }

  @test 'getLogins 1 user' () {
    const LOGIN = "user1";
    this.users.addUser(LOGIN, "1234");

    const logins = this.users.getLogins();

    expect(logins).to.have.lengthOf(1);
    expect(logins[0]).to.be.equal(LOGIN);
  }

  @test 'hasUser' () {
    const LOGIN = "user1";

    this.users.addUser(LOGIN, "1234");

    assert.isTrue(this.users.hasUser(LOGIN));
  }

  @test 'hasUser no user with this login' () {
    assert.isFalse(this.users.hasUser("user1"));
  }

  @test 'getPassword' () {
    this.users.addUser("user", "1234");

    expect(this.users.getPassword("user")).to.be.equal('1234');
  }

  @test 'getPassword no user with such login' () {
    expect(this.users.getPassword("user")).to.be.equal('');
  }

  @test 'removeUser' () {
    this.users.addUser("user1", "1234");

    this.users.removeUser("user1");

    expect(this.users.Count).to.be.equal(0);
  }

  @test 'removeUser nonexistent user' () {
    this.users.addUser("user1", "1234");

    this.users.removeUser("user2");

    expect(this.users.Count).to.be.equal(1);
  }

  @test 'save' () {
    this.users.addUser("user1", "1234");

    this.users.save();

    assert.isFalse(this.users.isModified());
    assert.isTrue(this.users.wasSaved());
  }

  @test 'isModified' () {
    assert.isFalse(this.users.isModified());
  }

  @test 'addUser isModified' () {
    this.users.addUser("user", "1234");

    assert.isTrue(this.users.isModified());
  }

  @test 'removeUser non existent isModified false' () {
    this.users.removeUser("user");

    assert.isFalse(this.users.isModified());
  }

  @test 'removeUser after save' () {
    this.users.addUser("user", "1234");
    this.users.save();

    this.users.removeUser("user");

    assert.isTrue(this.users.isModified());
  }

  @test 'build' () {
    this.users.addUser("user", "1234");
    const builder = new Builder(new XmlSerializer());

    this.users.build(builder);

    const expected = '<users><user login="user" passwd="1234"/></users>';
    expect(builder.getResult()).to.be.equal(expected);
  }

  @test 'load' (){
    const loader = new Loader('<users><user login="root" passwd="1234"/></users>', new XmlDeserializer());

    this.users.load(loader);

    expect(this.users.Count).to.be.equal(1);
    assert.isTrue(this.users.hasUser('root'));
  }
}