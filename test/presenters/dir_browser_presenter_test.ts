import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { DirBrowserPresenter } from "../../src/presenters/dir_browser_presenter";

@suite class DirBrowserPresenterTest {
    private presenter: DirBrowserPresenter;

    before(){
        this.presenter = new DirBrowserPresenter();
    }

    @test 'getCurrentFullPath' (){
        expect(this.presenter.getCurrentFullPath()).to.be.equal('/');
    }

    @test 'list' (){
        expect(this.presenter.list()).to.have.deep.members([{name: 'home', type:'dir'}, {name: 'main.proj', type: 'project'}]);
    }

    @test 'listDirs' (){
        const onlyDirs = true;

        const dirs = this.presenter.list(onlyDirs)
        expect(dirs).not.contains('main.proj');
        expect(dirs).to.deep.contain({name:'home',type:'dir'});
    }

    @test 'open dir' (){
        this.presenter.open('home');

        expect(this.presenter.list()).to.deep.include.members([{name:'..',type:'dir'}, {name:'images',type:'dir'}]);
        assert.equal(this.presenter.getCurrentFullPath(), '/home');
    }

    @test 'open project' (){
        this.presenter.open('main.proj');

        assert.equal(this.presenter.getCurrentFullPath(), '/');
    }

    @test 'open .. dir' (){
        this.presenter.open('home');

        this.presenter.open('..');

        expect(this.presenter.list()).to.deep.contain({name:'home',type:'dir'});
        assert.equal(this.presenter.getCurrentFullPath(), '/');
    }

    @test 'open .. in root dir' (){
        this.presenter.open('..');

        assert.equal(this.presenter.getCurrentFullPath(), '/');
        expect(this.presenter.list()).not.contains('..');
    }

    @test 'createDir' (){
        this.presenter.createDir('new_folder');

        expect(this.presenter.list()).to.deep.contain({name:'new_folder',type:'dir'});
    }

    @test 'isProject dir passed' (){
        assert.isFalse(this.presenter.isProject('home'));
        assert.isTrue(this.presenter.isProject('main.proj'));
    }
}
