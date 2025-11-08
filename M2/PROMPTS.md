# Lekcja 5 (Speech To Text)

## STT Prompt

> This is a prompt that I would like you to enhance in a way that you make it more clear, more structurized, reorder if you think it makes the text easier to understand, remove potential repetition apply markdown format preferably.
> 
> If something is uncertain, please ask me explicitly.
> 
> Your output should be basically my enhanced prompt. And only when you've got some questions to answer then please write them all uppercase, screaming case, so that it would be easier for me  to identify it and answer you.

## ENHANCE & CLEAR - JAVA APP

superwhisper mode
enhance & clear
claude 4 sonnet

META (TTS) PROMPT:
> This is a prompt that I would like you to enhance in a way that you make it more clear, more structurized, reorder if you think it makes the text easier to understand, remove potential repetition apply markdown format preferably.
> 
> If something is uncertain, please ask me explicitly.
>
> Your output should be basically my enhanced prompt. And only when you've got some questions to answer then please write them all uppercase, screaming case, so that it would be easier for me to identify it and answer you.

My prompt:
> I wanted to create a Java application that would use Spring under the hood and Hibernate for data access. It needs to expose some rest endpoints that would access the data and maybe two or three collections, you know, standard operations on data.

Output:
```md
# Java Spring Boot Application with Hibernate - Enhanced Requirements

## **Project Overview**
Create a Java application using:
- **Framework**: Spring Boot
- **Data Access**: Hibernate ORM
- **API Type**: REST endpoints
- **Operations**: Standard CRUD operations

## **Technical Stack**
- **Backend**: Java + Spring Boot
- **ORM**: Hibernate
- **API**: RESTful web services
- **Database Operations**: Create, Read, Update, Delete

## **Functional Requirements**
- Expose REST endpoints for data access
- Implement standard data operations (CRUD)
- Handle 2-3 data collections/entities

## **Questions for Clarification**

**WHAT DATABASE SYSTEM WOULD YOU LIKE TO USE (E.G., MYSQL, POSTGRESQL, H2)?**

**WHAT ARE THE 2-3 DATA ENTITIES/COLLECTIONS YOU WANT TO MANAGE?**

**DO YOU NEED ANY SPECIFIC AUTHENTICATION/AUTHORIZATION?**

**WHAT BUILD TOOL DO YOU PREFER (MAVEN OR GRADLE)?**

**DO YOU NEED ANY SPECIFIC VALIDATION OR ERROR HANDLING REQUIREMENTS?**
```

## ENHANCE & CLEAR - BROWSER EXTENSION

superwhisper mode
enhance & clear
claude 4 sonnet

My Prompt:
> I want you to help me to generate a Chrome browser extension, which when opened, allows me to define the sites per domain that I want to block, sites or domains, maybe with some, you know, using asterisk as a wild card. And I can turn it on or turn it off. Also, besides that, for all browser tabs that are active, it would calculate with the granularity of seconds, how long do I spend on these sites? So if I walk away from a tab or it's, you know, on a screen that I'm not using, et cetera, it would not be calculated. But I want to track basically how much time do I spend on certain pages so that I can basically, you know, verify my habits. So it's a productivity application. So please provide quite a simple UI for this. And what I care is that you would create all the files with all the content for me please.

A:
```md
# Chrome Extension Development Request

## Project Overview
You want me to create a **productivity-focused Chrome browser extension** that combines website blocking and time tracking functionality.

## Core Features

### 1. Website Blocking
- **Domain Management**: Define sites/domains to block
- **Wildcard Support**: Use asterisk (*) as wildcards for flexible blocking patterns
- **Toggle Control**: Enable/disable blocking functionality

### 2. Time Tracking
- **Active Tab Monitoring**: Track time spent only on active, visible tabs
- **Granular Precision**: Calculate time with second-level accuracy
- **Habit Analysis**: Monitor browsing patterns for productivity insights
- **Inactive Detection**: Exclude time when tabs are inactive or not in focus

### 3. User Interface
- **Simple Design**: Clean, intuitive interface
- **Easy Configuration**: Straightforward setup for blocked sites
- **Time Reports**: Display tracked browsing time data

## Deliverables
- Complete Chrome extension with all necessary files
- Full source code for immediate deployment
- Manifest file and required permissions
- Background scripts for functionality
- Popup UI for user interaction

## Questions for Clarification

**HOW WOULD YOU LIKE THE TIME TRACKING DATA TO BE DISPLAYED? (e.g., daily summaries, weekly reports, real-time counters)**

**DO YOU WANT THE EXTENSION TO STORE DATA LOCALLY OR SYNC ACROSS DEVICES?**

**SHOULD BLOCKED SITES SHOW A CUSTOM BLOCK PAGE OR JUST PREVENT NAVIGATION?**

**WHAT TIME FORMAT DO YOU PREFER FOR DISPLAYING TRACKED TIME? (e.g., hours:minutes:seconds, total minutes)**
```
