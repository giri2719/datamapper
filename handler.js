import {
  DynamoDbSchema,
  DynamoDbTable,
  embed,
  DataMapper,
} from "@aws/dynamodb-data-mapper";
import DynamoDB from "aws-sdk/clients/dynamodb.js";
import { v4 } from "uuid";

class Post {}
Object.defineProperties(Post.prototype, {
  [DynamoDbTable]: {
    value: "Posts",
  },
  [DynamoDbSchema]: {
    value: {
      id: {
        type: "String",
        keyType: "HASH",
        defaultProvider: v4,
      },
      authorUsername: { type: "String" },
      title: { type: "String" },
    },
  },
});
const client = new DynamoDB({ region: "ap-south-1" });
const mapper = new DataMapper({ client });

const post = new Post();
post.authorUsername = "User1";
post.title = "Hello, DataMapper";

mapper
  .put({ item: post })
  .then((post) => {
    return post.id;
  })
  .then((id) => {
    const toFetch = new Post();
    toFetch.id = id;
    return mapper.get({ item: toFetch });
  })
  .then((value) => {
    console.log(value);
  });
