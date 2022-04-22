import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { UsersPresenter } from "../../src/presenters/users_presenter";
import { Project } from "../../src/project";
import { ProjectFactory } from '../../src/mock_impl/project_factory';

@suite class UsersPresenterTest {
    private presenter: UsersPresenter;

    before(){
        this.presenter = new UsersPresenter();
        this.presenter.Project = new Project(new ProjectFactory());
    }

    after(){
        this.presenter.removeAll();
    }

    @test 'getLogins' (){
        assert.isArray(this.presenter.getLogins());
    }

    @test 'addUser' (){
        const name = 'root';
        const password = '1234';

        this.presenter.addUser(name, password);

        expect(this.presenter.getLogins()).to.contains(name);
    }

    @test 'addUser empty login' (){
        const name = '';
        const password = '1234';

        this.presenter.addUser(name, password);

        expect(this.presenter.getLogins()).to.not.include(name);
    }

    @test 'addUser twice the same login' (){
        const name = 'root';
        const password = '1234';

        this.presenter.addUser(name, password);
        this.presenter.addUser(name, password);

        expect(this.presenter.getLogins()).to.include.members([name]);
    }

    @test 'changeUser' (){
        this.presenter.addUser('root', '1234');

        this.presenter.changeUser('root', 'home', '123');

        expect(this.presenter.getLogins()).to.include.members(['home']);
    }

    @test 'getPasswordByLogin' (){
        this.presenter.addUser('root', '1234');

        expect(this.presenter.getPasswordByLogin('root')).to.be.equal('1234');
    }

    @test 'removeUser' (){
        this.presenter.addUser('root', '1234');

        this.presenter.removeUser('root');

        expect(this.presenter.getLogins()).to.be.empty;
    }
}
