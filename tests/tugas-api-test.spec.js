const { test, expect } = require("@playwright/test");
const { Ajv } = require("ajv");

const ajv = new Ajv()

test('GET Single User', async({request}) => {

    const response = await request.get('https://reqres.in/api/users/2');

    const responseData = await response.json();

    expect(response.status()).toBe(200);
    expect(responseData.data.id).toBe(2);
    expect(responseData.data.email).toBe("janet.weaver@reqres.in");
    expect(responseData.data.first_name).toBe("Janet");
    expect(responseData.data.last_name).toBe("Weaver");
    expect(responseData.data.avatar).toBe("https://reqres.in/img/faces/2-image.jpg");
    expect(responseData.support.url).toBe("https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral");
    expect(responseData.support.text).toBe("Tired of writing endless social media content? Let Content Caddy generate it for you.");


    const valid = ajv.validate(require('./jsonschema/get-schema-from-reqres.json'), responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    };

    expect(valid).toBe(true);
});

test('POST Single User', async({request}) => {

    const bodyData = {
        name: "morpheus",
        job: "leader"
    };

    const headerData = {
        Accept: 'application/json'
    }

    const response = await request.post('https://reqres.in/api/users', {
        headers: headerData,
        data: bodyData
    });

    const responseData = await response.json();

    expect(response.status()).toBe(201);
    expect(responseData.name).toBe("morpheus");
    expect(responseData.job).toBe("leader");
    expect(responseData).toHaveProperty('id');
    expect(typeof responseData.id).toBe('string');
    expect(responseData).toHaveProperty('createdAt');
    expect(typeof responseData.createdAt).toBe('string');

    const valid = ajv.validate(require('./jsonschema/post-schema-from-reqres.json'), responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    };

    expect(valid).toBe(true);
});

test('DELETE Single User', async({request}) => {
    
    const response = await request.delete('https://reqres.in/api/users/2');
    expect(response.status()).toBe(204);

});

test('PUT Single User', async({request}) => {

    const bodyData = {
        name: "morpheus",
        job: "zion resident"
    };

    const headerData = {
        Accept: 'application/json'
    }

    const response = await request.put('https://reqres.in/api/users/2', {
        headers: headerData,
        data: bodyData
    });

    const responseData = await response.json();

    expect(response.status()).toBe(200);
    expect(responseData.name).toBe("morpheus");
    expect(responseData.job).toBe("zion resident");
    expect(responseData).toHaveProperty('updatedAt');
    expect(typeof responseData.updatedAt).toBe('string');

    const valid = ajv.validate(require('./jsonschema/put-schema-from-reqres.json'), responseData);

    if (!valid) {
        console.error("AJV Validation Errors:", ajv.errorsText());
    };

    expect(valid).toBe(true);
});