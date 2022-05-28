import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port);

import { Client } from '@notionhq/client';
const notion = new Client({ auth: process.env.NOTION_ACCESS_TOKEN });
const response = await notion.search({ query: 'excerpts' });
const db_id = response.results[0].id;
const excerpts = await notion.databases.query({ database_id: db_id });

app.get('/data', async (req, res) => {
  const randomIndex = Math.round(Math.random() * excerpts.results.length);
  const page_id = excerpts.results[randomIndex].id;
  const page = await notion.pages.retrieve({ page_id: page_id });
  const content = page.properties.Excerpt.rich_text[0].plain_text;
  const book = await notion.pages.retrieve({ page_id: page.properties.Book.relation[0].id });
  const bookTitle = book.properties.Name.title[0].plain_text;
  const chapter = await notion.pages.retrieve({ page_id: page.properties.Chapter.relation[0].id });
  const chapterName = chapter.properties.Name.title[0].plain_text;
  const pageNumber = page.properties.Page.number;
  const data = {
    book: bookTitle,
    chapter: chapterName,
    page: pageNumber,
    content: content,
  };
  return res.json(data);
});
