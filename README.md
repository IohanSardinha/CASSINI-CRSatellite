# CRSatellite
## Developed for the 2023 CASSINI Hackaton

💎 **Idea**

In recent years, there has been an increase in the number of natural disasters due to the **increasing effects of climate change** , including floods, landslides and wildfires. These disasters disrupt the **logistical operations of emergency services,** significantly **increase** their **response time** ,and **reduce availability**. Our solution provides civil protection services with **real-time updates on road conditions** and optimal routes to reach their designated destinations. Our software uses information related to areas affected by natural disasters, such as floods and wildfires, provided by the Copernicus Emergency Management Service ( **Copernicus EMS** ), correlating them with road maps and checking for possible road blockages.

We aim to offer civil protection services and humanitarian aid organisations the tools to **avoid losing time in critical situations** by providing path directions that **circumvent road blockages** before user reports. This may be decisive when trying to access remote locations with minimal traffic.

🛰️ **EU space technologies**

Current systems that provide path directions currently rely on reports made by users to indicate road blockages. Suppose no reports are issued when a road is inaccessible. In that case, the service is unaware of this change and the calculated optimal route is not altered until a report is submitted. This delay could significantly impact emergency service response time. Leveraging satellite data allows for the early identification of road blockages before manual reports, preventing delays in route adjustments for emergency services.

Our software relies on satellite data sourced from the early warning components of the **Copernicus EMS** , namely the European Flood Awareness System ( **EFAS** ) and the European Forest Fire Information System ( **EFFIS** ), to **identify and pinpoint ongoing natural disasters**. This data is then processed to determine its impact on road infrastructure, enabling emergency services to safely and efficiently reach remote locations impacted by natural disasters.

The following datasets were used:

- **Flood Data** : 2023-11-1 Volumetric soil moisture on Soil Level 1 - River discharge and related historical data from the European Flood Awareness System
- **Fire Data** : 2021-02-28 Total Number of S3A nighttime active fires - Fire radiative power and active fire pixels from 2020 to present derived from satellite observations

Our prototype serves as a **proof of concept** ; the final product will access **real-time Copernicus data** and display all disasters detected by this system.

⛑️ **Space for International Development & Humanitarian Aid**

We focused on Challenge **1) Supporting sustainable infrastructure development**. Our team firmly believes that leveraging data from Copernicus systems can significantly contribute to monitoring critical infrastructure and planning for remote communities. This would enable better transportation and mobility during natural disasters by creating safer routes. Our solution can help reduce the impact of natural disasters in terms of improving access to remote locations and ensuring emergency services can effectively reach civilians in need.

🤼 **Team**

Business team

Project Manager - Francisco Ribeiro - First-year PhD student in Electrical and Computer Engineering. His thesis will focus on an adaptive optics control system tailored for Free Space Communication between Low Orbit Satellites and ground stations.

Product Researcher - André Enes - MSc in Electrical and Computer Engineering. Research Fellow at DIGI2 Laboratory exploring Predictive Maintenance and Anomaly Detection using low-cost sensors and Machine Learning.

Operations Engineer - Andrej Jastraban - R&D Process Engineer at FORVIA, specialising in digitalisation and deployment of technologies. MSc in Mechanical Engineering with a focus on automation and simulations.

Quality Engineer - Rodrigo Azevedo - MSc in Electrical and Computer Engineering at the University of Porto, specialising in electronics. Currently working at Synopsys as a Design Methodology Engineer.

Technology team

Data Analyst - Gabriella Fernandes - First-year PhD student in Electrical and Computer Engineering and Research Fellow at INESC TEC, specialising in wireless technologies, with a focus on semantic communications.

Data Analyst - Gonçalo Queirós - MSc in Electrical and Computer Engineering. Currently a first-year PhD student and Research Fellow at INESC TEC. His research focuses on 5G and 6G and networks and architectures.

Web Developer - André Assunção - MSc in Informatics and Computers Engineering, currently working at TripAdvisor as a FullStack Developer on Hospitality Solutions.

Web Developer - Iohan Sardinha - Cyclist and nature lover, in his free time, frequenting the first year of the PhD in Informatics Engineering at the University of Porto, specialising in Smart Cities and Transportation.
