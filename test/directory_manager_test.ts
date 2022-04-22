import * as _chai from 'chai';
import { expect, assert } from 'chai';
import { suite, test } from '@testdeck/mocha';

import { DirectoryManager } from "../src/mock_impl/directory_manager";

@suite class DummyDirectoryManagerTest {
    private man: DirectoryManager;

    before(){
        this.man = new DirectoryManager();
        this.man.setStruct(
            {
                "type": "dir",
                "children": {
                    "home": {
                        "type": "dir",
                        "children": {
                            "images": {
                                "type": "dir",
                                "children": {
                                }
                            }
                        }
                    },
                    "main.proj": {
                        "type": "project"
                    }
                }
            }
        );
    }

    @test 'createDir' (){
        this.man.createDir('/temp');

        expect(this.man.read('/')).to.include.members(['home', 'temp']);
    }

    @test 'read' (){
        expect(this.man.read('/')).to.include.members(['home']);
    }
}