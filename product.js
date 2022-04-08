import { EventEmitter } from 'events';

export default class Product {
	constructor({ onCreate, service }) {
		this.service = service;
		this.source = new EventEmitter();
		this.source.on('create', onCreate);
	}

	// # -> private function
	// data -> {description, id, price}
	#isValid(data) {
		const { description } = data;

		if (description.length < 5) {
			throw new Error('description must be at least 5 characters long');
		}
	}

	#toUpperCaseStrings(data) {
		const finalObject = Reflect.ownKeys(data)
			// .map returns an array with three objects
			.map((key) => {
				const item = data[key];

				return {
					[key]: typeof item === 'string' ? item.toUpperCase() : item,
				};
			})
			// .reduce returns an object with three props
			.reduce((prev, next) => {
				return {
					...prev,
					...next,
				};
			}, {});

		return finalObject;
	}

	async create(data) {
		this.#isValid(data);

		const mappedObject = this.#toUpperCaseStrings(data);
		const message = await this.service.save(mappedObject);

		this.source.emit('create', mappedObject);

		return message.toUpperCase();
	}
}
