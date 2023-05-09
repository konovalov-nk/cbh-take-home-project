# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Explanation

#### Add examples and specs

Before we can refactor the method, lets look into possible `event` shapes:

- `{ partitionKey: "abc123" }`
- `{ partitionKey: { example: "key" } }`
- `{ partitionKey: "a".repeat(MAX_PARTITION_KEY_LENGTH + 1) }`
- `{ name: "John Doe", age: 30 }`
- `{ name: "John Doe", age: 30, partitionKey: "abc123" }`
- `"a string"`
- `123`
- `true`
- `[1, 2, 3]`
- `0`
- `null`
- `undefined`
- `false`
- `""`

We can write every test scenario and see the output.
To make testing easier, I've extracted hashing into the `hashDigest` method.

```js
const DEFAULT_HASH_ALGORITHM = "sha3-512";

exports.hashDigest = (data, hashAlgorithm = DEFAULT_HASH_ALGORITHM) => {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  return crypto.createHash(hashAlgorithm).update(data).digest("hex");
}
```

#### Simplify the main method

Since we've added multiple edge cases and identified that `partitionKey` belongs to a set of scenarios,
I've decided to extract it into `getPossiblePartitionKey` method:

```js
const getPossiblePartitionKey = (event) => {
  const MAX_PARTITION_KEY_LENGTH = 256;
  const partitionKey = event?.partitionKey;
  let candidateKey;
  if (!partitionKey) { return null; }

  candidateKey = typeof partitionKey !== "string" ? JSON.stringify(partitionKey) : partitionKey;

  if (candidateKey.length > MAX_PARTITION_KEY_LENGTH) {
    return this.hashDigest(candidateKey);
  }

  return candidateKey;
}
```

The `MAX_PARTITION_KEY_LENGTH` logic belongs to the new method, since the only case where that might happen is when provided `partitionKey` is a string or object exceeding this length.
