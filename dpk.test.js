const { deterministicPartitionKey, hashDigest } = require("./dpk");

describe("deterministicPartitionKey", () => {
  describe("when given no event", () => {
    const events = [null, undefined, false, 0, ""];

    events.forEach((event) => {
      it(`when event is ${event} (type ${typeof event}), returns the literal '0'`, () => {
        const trivialKey = deterministicPartitionKey(event);
        expect(trivialKey).toBe("0");
      });
    });
  });

  describe("when given an event", () => {
    const event = { name: "John Doe", age: 30 };

    it("Returns a hash of the event", () => {
      const key = deterministicPartitionKey(event);
      expect(key).toBe(hashDigest(event));
    });

    describe("when event contains `partitionKey` property", () => {
      it("Returns the partition key", () => {
        const event = { partitionKey: "abc123" };
        const key = deterministicPartitionKey(event);
        expect(key).toBe("abc123");
      });
  
      describe("when `partitionKey` is an object", () => {
        it("Returns the stringified version of the key", () => {
          const event = { partitionKey: { example: "key" } };
          const key = deterministicPartitionKey(event);
          expect(key).toBe(JSON.stringify({ example: "key" }));
        });
      });
  
      describe("when `partitionKey` is null", () => {
        it("Returns the hash of the event", () => {
          const event = { partitionKey: null };
          const key = deterministicPartitionKey(event);
          expect(key).toBe(hashDigest(event));
        });
      });
    });
  });

  describe("edge cases", () => {
    describe("when the event is a string", () => {
      it("Returns a hash of the string", () => {
        const event = "a string";
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(JSON.stringify(event)));
      });
    });

    describe("when the event is a number", () => {
      it("Returns a hash of the number", () => {
        const event = 123;
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(event));
      });
    });

    describe("when the event is a boolean", () => {
      it("Returns a hash of the boolean", () => {
        const event = true;
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(event));
      });
    });

    describe("when the event is an array", () => {
      it("Returns a hash of the array", () => {
        const event = [1, 2, 3];
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(event));
      });
    });

    describe("when `partitionKey` is longer than the maximum allowed length", () => {
      it("Returns a hash of the `partitionKey`", () => {
        const partitionKey = "a".repeat(257);
        const event = { partitionKey, age: 30 };
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(partitionKey));
      });
    });

    describe("when `partitionKey` is an object with property longer than the maximum allowed length", () => {
      it("Returns a hash of the stringified `partitionKey`", () => {
        const partitionKey = { example: "a".repeat(257) };
        const event = { partitionKey, age: 30 };
        const key = deterministicPartitionKey(event);
        expect(key).toBe(hashDigest(JSON.stringify(partitionKey)));
      });
    });
  });
});
