import assert from 'assert';
import Product from './product.js';
import Service from './service.js';

// node spy
const callTracker = new assert.CallTracker();
// when the program is done executing, validate all the calls
process.on('exit', () => callTracker.verify());

// should throw an error when description is less than 5 characters long
{
	const params = {
		description: 'my p',
		id: 1,
		price: 100,
	};

	const product = new Product({
		onCreate: () => {},
		service: new Service(),
	});

	// promise that was rejected (failed)
	// error message received
	// test description
	assert.rejects(
		() => product.create(params),
		{ message: 'description must be at least 5 characters long' },
		'it should throw an error when description is invalid'
	);
}

// should save product successfully
{
	const params = {
		description: 'my product',
		id: 1,
		price: 100,
	};

	// define how many times the function is expected to run
	const spyServiceSave = callTracker.calls(1);

	const serviceStub = {
		async save(params) {
			// make sure the function save was executed one time
			spyServiceSave(params);
			return `${params.id} saved with sucess!`;
		},
	};

	const stub = (msg) => {
		// inside the stub, validate the params that the function was called with
		assert.deepStrictEqual(msg.id, params.id, 'ids should be the same');
		assert.deepStrictEqual(msg.price, params.price, 'prices should be the same');
		assert.deepStrictEqual(
			msg.description,
			params.description.toUpperCase(),
			'descriptions should be the same'
		);
	};

	const spyProductOnCreate = callTracker.calls(stub, 1);

	const product = new Product({
		onCreate: spyProductOnCreate,
		service: serviceStub,
	});

	const result = await product.create(params);
	const expectedResult = `${params.id} SAVED WITH SUCESS!`;

	assert.deepStrictEqual(result, expectedResult);
}
