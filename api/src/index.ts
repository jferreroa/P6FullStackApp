import { ApolloServer, gql } from "apollo-server";
import { MongoClient } from "mongodb"
const typeDefs = gql`
    type Person{
        _id:ID!
        name:String!
        surname:String!
    }
    type Query{
        test: String
        getPeople:[Person]
    }

    type Mutation{
        addPerson(name:String!, surname:String!): Person
        deleteall:String!
        modifyPerson(name:String!, surname:String!, newName:String!,newSurname:String!): String
        deletePerson(name:String!, surname:String!): String
    }
`

const resolvers = {
    Query: {
        test: (): string => "Working OK!",
        getPeople: async (parent: any, args: any, ctx: { db: any; }) => {
            console.log("GETPEOPLE API")
            const db = ctx.db
            return await db.collection("people").find({}).toArray()

        }
    },
    Mutation: {
        addPerson: async (parent: any, args: { name: string; surname: string; }, ctx: { db: any; }) => {
            console.log("ADDPERSON API")
            const db = ctx.db
            const { name, surname } = args
            console.log(args, " add person")
            const { insertedId } = await db.collection("people").insertOne({ name, surname }) //es lo que devulve, mirar docs d insert 
            return { name, surname, _id: insertedId }
        },

        deleteall: async (parent: any, args: any, ctx: { db: any; }) => {
            const db = ctx.db
            await db.collection("people").deleteMany({})
            return "ouii"
        },
        modifyPerson: async (parent: any, args: { name: string; surname: string, newName: string, newSurname:string }, ctx: any) => {
            const db  = ctx.db
            const { name, surname, newName, newSurname  } = args
            const finded = await db.collection("people").findOne({ name: name, surname: surname})
            if(finded){
                await db.collection("people").updateOne({name: name, surname: surname}, {$set:{name:newName,surname:newSurname}})
                return "updated"
            }
            else return "not finded"
        },
        deletePerson: async (parent: any, args: { name: string, surname: string}, ctx: any) => {
            const db = ctx.db
            const { name, surname} = args
            console.log(args, " delete person")
            const finded = await db.collection("people").findOne({ name:name,surname:surname })

            if (finded) {
                await db.collection("people").deleteOne({name: name,surname:surname })
                return "eliminado"
            }
            else
            return "not finded"

        }

    }
}


const mongoURL = process.env.MONGO_URL //definida en docker
if (!mongoURL) {
    console.log("error, env variable not defined :( ")
} else {
    const client = new MongoClient(mongoURL)
    try {
        client.connect().then(() => {
            console.log("DB CONNECTED aaa")
            const server = new ApolloServer({
                typeDefs,
                resolvers,
                context: () => { return { db: client.db("test") } } //quitar parentesis??
            });
            server.listen().then((url) => {
                console.log("escuchando en", url.url)
            })
        })
    } catch (error) {
        console.log(error)

    }

}



