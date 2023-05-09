const crypto = require("crypto");
const DEFAULT_HASH_ALGORITHM = "sha3-512";

exports.hashDigest = (data, hashAlgorithm = DEFAULT_HASH_ALGORITHM) => {
  if (typeof data !== "string") {
    data = JSON.stringify(data);
  }

  return crypto.createHash(hashAlgorithm).update(data).digest("hex");
}

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

exports.deterministicPartitionKey = (event) => {
  const TRIVIAL_PARTITION_KEY = "0";
  if (!event) { return TRIVIAL_PARTITION_KEY; }

  if (typeof event === "string") {
    return this.hashDigest(JSON.stringify(event));
  }

  return getPossiblePartitionKey(event) || this.hashDigest(event);
};
