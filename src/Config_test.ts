import { assertEquals } from '../test_deps.ts'
import * as config from './Config.ts'

Deno.test("test_config_sizeToString", function () {
    let size: config.Size = {
        width:100,
        height:200
    }
   let res =  config.sizeToString(size);
   assertEquals(res, "100,200");
})

Deno.test("test_config_stringToSize", function () {
   let res = config.stringToSize("100,200");
   assertEquals(res.height, 200);
   assertEquals(res.width, 100);
})

