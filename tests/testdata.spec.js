import jsondata from "../testdata/jsonData.json"
import readCSV from "../utils/csvReader";
import {test,expect} from '@playwright/test'


test.beforeEach("before each test",async({page},testInfo)=>{
    
    console.log(`Test Name: ${testInfo.title}`);
})
test('fetch data using jsonfile',async()=>{
    for (const data of jsondata) {
        console.log(`Name: ${data.name}`);
        console.log(`Age: ${data.age}`);
    }
   

})
test('fetch data using CSV file', async () => {
    const testData = await readCSV('./testdata/testdata.csv');
    for (const row of testData) {
        console.log(`Name: ${row.name}`);
        console.log(`Age: ${row.age}`);
    }
    expect(2%2===0).toBe(false)
});
test.afterEach("after each test",async({},testInfo)=>{
    console.log(`Test status: ${testInfo.status}`);
})
