import { MongoClient } from 'mongodb';

console.log("Let's get MongoDB working!");
console.log(`user = ${process.env.user}`);
console.log(`pass = ${process.env.pass}`);

async function main() {
  const uri =
    'mongodb+srv://' +
    process.env.user +
    ':' +
    process.env.pass +
    '@dev-cluster' +
    '.vvwni.azure.mongodb.net/test?retryWrites=true&w=majority';

  const client: MongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();

    await listDB(client);

    await listCollections(client);

    await create(client);

    await read(client);
  } catch (ex) {
    console.error(ex);
  } finally {
    await client.close();
  }
}

async function listDB(client: MongoClient) {
  const databaseList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databaseList.databases.forEach(db => console.log(` - ${db.name}`));
}

async function listCollections(client: MongoClient) {
  const collections = await client.db('test-db').listCollections().toArray();

  collections.forEach(c => console.log(`Collection name: ${c.name}`));
}

async function create(client: MongoClient) {
  //Creates collection if it doesn't exist and adds the given document
  const resultInsertOne = await client
    .db('test-db')
    .collection('test-faraday')
    .insertOne({
      foo: 'manchu-2',
      bar: 320,
      date: new Date()
    });

  console.log('Result insert one:');
  console.log(resultInsertOne);

  const resultInsertMany = await client
    .db('test-db')
    .collection('test-faraday')
    .insertMany([
      {
        foo: 'manchu-2',
        bar: 320,
        date: new Date()
      },
      {
        buda: 'dharma',
        charles: 'chaplin',
        date: new Date()
      }
    ]);

  console.log('Result insert many:');
  console.log(resultInsertMany);
}

async function read(client: MongoClient) {
  let first = await client.db('test-db').collection('test-faraday').findOne({});

  console.log('Find one:');
  console.log(first);

  first = await client.db('test-db').collection('test-faraday').findOne({
    buda: 'dharma'
  });

  console.log('Find one: {buda: "dharma"}');
  console.log(first);

  console.log('Find all:');
  console.log(
    await client
      .db('test-db')
      .collection('test-faraday')
      .find({})
      .project({})
      .toArray()
  );
}

main().catch(console.error);
