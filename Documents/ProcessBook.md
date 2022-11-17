# Process Book

## Basic Info

### Project Title

Causes of Deaths

### Members

| Name            | Email                 | ID     |
| --------------- | --------------------- | ------ |
| ChenXiao Liu    | chenxiao.l@wustl.edu  | 499688 |
| Pingchuan Huang | h.pingchuan@wustl.edu | 503954 |
| Hongyi Xu       | hongyi.x@wustl.edu    | 499173 |

### GitHub

- Repo: <https://github.com/csex57/causeofdeath>
- Page: <https://csex57.github.io/causeofdeath>

## Overview and Motivation

People die for various reasons. Sometimes we only know about some diseases that appear more in the public eye such as cancers and car accidents. However, some diseases that also take many lives each year do not receive enough attention. With continuous medical advances and technological developments, many diseases disappeared and some new diseases started growing up. It would be helpful if one could gather all the death reasons and death count together and show it properly to the public. In this case, we would like to show all of the death reasons and death counts for every country. We also want to show the trend of different death reasons to let the public know which death reason needs more attention. This will give intuition into the future direction of medical research, and the focus of each country on different diseases.

### Objectives

- We would like to illustrate and rank death reasons and death counts among diseases effectively.
- Users should also be able to see the top 3 causes of death reason.
- We want to see the changes and trends in these numbers.
- Users can view all the death types and their trends through the years.
- We also want to show every country’s death rate and the specific death rate for each disease.

## Related Work

The motivation and the project's content are inspired by the data from Kaggle and the design of Assignment 2. Throughout Assignment 2,  we visualized the election outcomes and the contribution of different states over multiple years, we are inspired by the design of the timeline widget that users can click on and switch from different years. We found it helpful and meaningful to help people catch and consider the trend of numbers over years.

![relatedWork](.\assets\relatedWork.png)

Kaggle: <https://www.kaggle.com/datasets>

Assignment2: <https://wustl.instructure.com/courses/90301/assignments/451475>

## Questions

### What's the main content or elements that this project want to visualize?

We would like to illustrate and rank death reasons and death counts among diseases effectively. For example, users should be able to see the number of people who died from Drowning in 2015. Users should also be able to see the top 3 causes of death reason. Additionally, we can see the changes and trends in these numbers. In this way, users can view all the death types and their influence through the years. We also want to show every country’s death rate and the specific death rate for each disease so that users can know which death reason is the most serious in their country.

#### Benefits

- Data can be filtered by different countries, different years, and different death reasons. Users can see any kind of data that they would like to know.
- A good intuition for the future medical research focus and the country government's social health insurance focus.

### How to accomplish those goals with your visualization properly?

We will first think about how to build our visualization, and what components or charts we should use to make our visualization clean and display the data clearly. We then put ourselves in the user's shoes and think about what information they might want to know and how they like to see that information. We will do our best to plan and display each chart that needs to be displayed while trying to learn new knowledge to solve some possible problems or techniques that are not easy to implement.

#### Benefits

- Our visualizations will be readable and usable. It will be a user-friendly visualization.
- A good intuition for the future medical research focus and the country government's social health insurance focus. The data that needs to be displayed will not be confusing, and the information that the data wants to convey will be clearly shown.

### How did these questions evolved throughout the project

We would like to effectively display the number of death in different categories of each country. Until now, we managed to get the map working and colored each country based on the death count, and tooltips will show up when hovering, such that users can get a clear idea of the number of deaths and the trend of them as time goes by.

In the following weeks, we will implement other charts to make the public aware of some specific dangerous diseases and incidents.

## Data

We found our dataset on the *country code* website and Kaggle.

- Country Populations: <https://countrycode.org/>
- Cause of Deaths around the World (Historical Data): <https://www.kaggle.com/datasets/iamsouravbanerjee/cause-of-deaths-around-the-world>

The main dataset (the second one) contains the death count of various reasons for each country from 1990 to 2019.

## Data Processing and Exploratory Data Analysis

### Do you expect to do substantial data cleanup?

No, the dataset has no significant missing fields. The dataset is very clean in the first place. We only need to do some (maybe a lot) calculations.

### What quantities do you plan to derive from your data?

- The proportion of deaths counts for various reasons.
- The percentage of death in the population.
- Each country’s different death counts for different death reasons every year.
- Ranking.

### How will data processing be implemented?

We are going to sum and sort the data based on the death count of various reasons and group them together by country/reason. The death percentage can be calculated from the data above as well.

### Evolve throughout the project

When working on the implementation, we found that this dataset's formation is not ideal for developing and writing JavaScript code. So we employed Python for the data processing and re-generated data format. We mainly changed the structure of data, from CSV to JSON which not only works better with JavaScript but made the data much clear to analyze and use, for each year and country. The following shows the original CSV and the processed JSON.

![csvdata](.\assets\csvdata.PNG)

![jsondata](.\assets\jsondata.PNG)

## Design Evolution

### Current Implementation

We have implemented the overall structure of the website, including the navigator on the left side and the visualizations on the main portion. We have set our project's name and logo on this website. In addition, we have created the Geo Graphs for both 2D and 3D, users will be able to drag and zoom the map using their mouse. Additionally, the opacity and darkness of each country are based on the number of deaths, and users can see the exact number by hovering over different countries.  On the other hand, users can choose the year from 1990 to 2019 by clicking on the year bar at the top of the webpage to filter the data, and visualizations will be updated based on that. The map will show each country's total death people.

<img src="assets/map.gif" alt="map" style="zoom:200%;" />

![implement3](.\assets\implement3.PNG)

![implement1](.\assets\implement1.PNG)

![implement2](.\assets\implement2.PNG)

### Design upon Project Proposal

The  design of the webpage would be divided into 2 parts. The left portion would be some buttons and inputs that allow users to switch between different visualizations. On the right side, the real visualization will be displayed.

- **Title and Icons**: There will be a title and an icon that shows our project on the top left part. We will use the black font color and an electrocardiogram logo to better match our project content.
- **Navigation Bar**: There will be a navigation bar on the left side. Users can click those different buttons in the navigation bar to go into different content visualizations.
- **Earth Map**: There will be a thumbnail of the 3D Earth map in the left bottom corner. Users can see the general world death rate map there. Countries will be given different colors with the rank of the death rate.
- **Stacked Bar Chart:** For Vis 1 in the navigation, there will be a stacked bar chart showing different countries' death counts. Each country represents a bar. Every bar will be split into different parts with different colors, each color will represent one disease type. Users can clearly see which disease type occupies the most length of each bar.
- **Line Chart**: For Vis 1 in the navigation, there will be a death count line chart in the bottom right part. It will show the trend of the total number of deaths per year in the world. Users can also use a dropdown to filter it by country.
- **2D  Map**: For the Vis 2 in the navigation, there will be a 2D map showing all of the worlds on the right side. When Users hover their mouse on any specific country part. Then a tooltip will show this country's death count, death rate, and top 3 death reasons. Users can also update this map by year.
- **Another Bar Chart**: For Vis 3 in the navigation, there will be another bar chart showing the total number of world death for each disease. Every death reason will be ranked and shown on this bar chart. The horizontal coordinate will be the cause of death and the vertical coordinate will be the proportion of deaths by that factor to the total number of deaths. Users can also update this map by year. In this way, users can view each year's death factor proportion and know how these diseases developed or disappeared.

![Screenshot 2022-10-30 at 2.23.26 PM](.\assets\Screenshot 2022-10-30 at 2.23.26 PM.png)

#### 3D Map Design vs. 2D Map Design

3D Map: A 3D ball-shaped map rotates automatically. The ball shape map’s advantage is visually appealing. The disadvantage of this type of map is it can not show one specific country directly to users until users drag the map to find it. Sometimes users may feel struggling to find that country.

![Screenshot 2022-10-30 at 2.24.35 PM](.\assets\Screenshot 2022-10-30 at 2.24.35 PM.png)

2D Map: A 2D map that shows all of the countries on the stage. The advantage of it is it can show all of the countries clearly and make it easier for users to find one specific country. The disadvantage of this is it may occupy most space of the website and is not visually appealing enough.

![Screenshot 2022-10-30 at 2.25.09 PM](.\assets\Screenshot 2022-10-30 at 2.25.09 PM.png)

#### Line Chart

This line chart shows the death count trend from 1900+ to 2015. Users can also use a dropdown to choose one country to see this country’s death count trend.

![Screenshot 2022-10-30 at 2.26.18 PM](.\assets\Screenshot 2022-10-30 at 2.26.18 PM.png)

#### Pie Chart vs. Bar Chart

Although the pie chart is useful for showing the proportions of death reasons/countries, it is restricted by size. There are many different reasons and countries that the pie chart would be too crowded to show useful information.

![Screenshot 2022-10-30 at 2.26.57 PM](.\assets\Screenshot 2022-10-30 at 2.26.57 PM.png)

The bar chart, however, can be extended horizontally infinitely, and easy to see the order sorted by death counts, and the countries/reasons for the top death rate can be easily shown, which easily become our best choice.

![Screenshot 2022-10-30 at 2.27.35 PM](.\assets\Screenshot 2022-10-30 at 2.27.35 PM.png)

#### Stacked Bar Chart

The stacked bar chart also meets our requirements, and it shows more detailed information about like sub-categories compared to a simple bar chart.

![IMG_FEFC0567610C-1](.\assets\IMG_FEFC0567610C-1.jpeg)

## Evaluation

We would like to effectively display the number of death in different categories of each country. Until now, we managed to get the map working and colored each country based on the death count, and tooltips will show up when hovering, such that users can get a clear idea of the number of deaths and the trend of them as time goes by.

In the following weeks, we will implement other charts to make the public aware of some specific dangerous diseases and incidents.
