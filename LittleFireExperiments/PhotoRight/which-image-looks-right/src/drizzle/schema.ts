// src/drizzle/schema.ts
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const whichToolYouPick = pgTable('whichToolYouPick', {
  id: serial('id').primaryKey(),
  duration: text('duration').notNull(),
  selected: text('selected').notNull(),
  order: text('order').notNull(),
  prolificId: text('prolificId').notNull(),
  studyId: text('studyId').notNull(),
  sessionId: text('sessionId').notNull(),
}); 

export const whichFoodIsGood = pgTable('whichFoodIsGood', {
  id: serial('id').primaryKey(),
  startTime: serial('startTime').notNull(),
  endTime: serial('endTime').notNull(),
  selected: text('selected').notNull(),
  foodType: text('foodType').notNull(),
  firstCooked: text('firstCooked').notNull(),
  secondCooked: text('secondCooked').notNull(),
  prolificId: text('prolificId').notNull(),
  studyId: text('studyId').notNull(),
  sessionId: text('sessionId').notNull(),
});

export const whatMakesMagicReal = pgTable('whatMakesMagicReal', {
  id: serial('id').primaryKey(),
  duration: text('duration').notNull(),
  selected: text('selected').notNull(),
  order: text('order').notNull(),
  prolificId: text('prolificId').notNull(),
  studyId: text('studyId').notNull(),
  sessionId: text('sessionId').notNull(),
});

export const agreeOrDisagree = pgTable('agreeOrDisagree', {
  id: serial('id').primaryKey(), // WARNING: out of date, but works and this is such a small project so it's fine
  duration: text('duration').notNull(),
  question: text('question').notNull(),
  value: text('value').notNull(),
  order: text('order').notNull(),
  prolificId: text('prolificId').notNull(),
  studyId: text('studyId').notNull(),
  sessionId: text('sessionId').notNull(),
});

export const whichImageLooksRight = pgTable('whichImageLooksRight', {
  id: serial('id').primaryKey(),
  duration: text('duration').notNull(),
  selected: text('selected').notNull(),
  order: text('order').notNull(),
  prolificId: text('prolificId').notNull(),
  studyId: text('studyId').notNull(),
  sessionId: text('sessionId').notNull(),
});