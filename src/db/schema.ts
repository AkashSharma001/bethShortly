
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";


export const shortener = sqliteTable('shortener',{
    id:integer('id',{mode:"number"}).primaryKey({autoIncrement:true}),
    url:text('url').notNull(),
    urlId:text('urlId').notNull(),
    userId: integer('userId').references(() => auth.id).notNull()

})

export const auth = sqliteTable('auth',{
    id:integer('id',{mode:"number"}).primaryKey({autoIncrement:true}),
    email:text('email').notNull(),
    password:text('password').notNull(),

})

// import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// // Optimized shortener table definition
// export const shortener = sqliteTable('shortener', {
//     id: integer('id', { mode: 'number', primaryKey: true, autoIncrement: true }),
//     url: text('url', { notNull: true }),
//     urlId: text('urlId', { notNull: true }),
// });

// // Optimized userDetails table definition with a foreign key
// export const userDetails = sqliteTable('auth', {
//     id: integer('id', { mode: 'number', primaryKey: true, autoIncrement: true }),
//     url: text('url', { notNull: true }),
//     urlId: text('urlId', { notNull: true }),
//     shortenerId: integer('shortenerId', { notNull: true, foreignKey: { table: 'shortener', field: 'id' } }),
// });
