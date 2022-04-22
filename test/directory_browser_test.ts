import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { DirectoryManager } from "../src/mock_impl/directory_manager";
import { DirectoryBrowser } from "../src/directory_browser";

@suite class DirectoryBrowserTest {
    private browser: DirectoryBrowser;

    before(){
        const man = new DirectoryManager();
        man.setStruct(
            {
                "children": {
                    "home": {
                        "children": {
                            "images": {
                                "children": {
                                }
                            }
                        }
                    },
                    "main.proj": {}
                }
            }
        );
        this.browser = new DirectoryBrowser(man);
    }

    @test 'getCurrentFullPath' (){
        expect(this.browser.CurrentPath).to.be.equal('/');
    }

    @test 'list' (){
        expect(this.browser.list()).to.include.members(['home', 'main.proj']);
    }

    @test 'listDirs' (){
        const dirs = this.browser.listDirs();

        expect(dirs).does.not.contain('main.proj');
        expect(dirs).to.include.members(['home']);
    }

    @test 'open dir' (){
        this.browser.open('home');

        expect(this.browser.list()).to.include.members(['..', 'images']);
        assert.equal(this.browser.CurrentPath, '/home');
    }

    @test 'open two dirs' (){
        this.browser.open('home');
        this.browser.open('images');

        expect(this.browser.list()).to.include.members([]);
        assert.equal(this.browser.CurrentPath, '/home/images');
    }

    @test 'open project' (){
        this.browser.open('main.proj');

        assert.equal(this.browser.CurrentPath, '/');
    }

    @test 'open .. dir' (){
        this.browser.open('home');

        this.browser.open('..');

        expect(this.browser.list()).contains('home');
        assert.equal(this.browser.CurrentPath, '/');
    }

    @test 'open .. in root dir' (){
        this.browser.open('..');

        assert.equal(this.browser.CurrentPath, '/');
        expect(this.browser.list()).not.contains('..');
    }

    @test 'createDir in root dir' (){
        this.browser.createDir('new_folder');

        expect(this.browser.list()).contains('new_folder');
    }

    @test 'createDir' (){
        this.browser.open('home');

        this.browser.createDir('new_folder');

        expect(this.browser.list()).contains('new_folder');
    }

    @test 'isProject' (){
        assert.isFalse(this.browser.isProject('home'));
        assert.isTrue(this.browser.isProject('main.proj'));
        assert.isFalse(this.browser.isProject('.project'));
        assert.isFalse(this.browser.isProject('main.proj1'));
    }
}
