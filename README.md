# CityPulse 🏙️  
Urban Infrastructure Incident Management Platform

CityPulse is a web-based platform that enables citizens to report civic infrastructure issues and ensures they are routed, prioritized, and resolved transparently by the appropriate municipal departments.

Built for hackathons with a focus on **accountability, reduced duplication, and clear workflows**.

---

## 🚩 Problem Statement

Cities receive thousands of complaints related to infrastructure such as potholes, electricity failures, water leaks, and sanitation issues.  
These complaints often suffer from:
- Lack of clear ownership
- Duplicate reports causing noise
- Poor prioritization
- Zero transparency for citizens

CityPulse solves this by enforcing **department-based routing**, **duplicate consolidation**, and **priority-driven resolution**, while keeping the entire process visible.

---

## 💡 Solution Overview

CityPulse provides a structured workflow:

1. **Citizens** report issues
2. **Authorities** validate and assign them to the correct department
3. **Department staff** resolve issues based on priority
4. **Duplicate complaints** increase urgency instead of clutter
5. **Public transparency** ensures accountability

---

## 🧠 Core Features

### 1. Department-Based Routing
- Each issue category maps to a specific department
- Authorities can confirm or reassign departments
- Departments only see issues relevant to them

### 2. Department-Specific Staff Workers
- Staff workers belong to one department
- Workers can only act on issues assigned to their department
- Reduces errors and enforces responsibility

### 3. Duplicate Complaint Handling
- Complaints with the same problem type and location are grouped
- Instead of creating new issues, a `requestCount` is increased
- Converts repetition into measurable urgency

### 4. Priority-Based Resolution
Issues are prioritized using:
- Number of requests (higher demand first)
- Age of the issue (older issues first)

This ensures fairness and effective resource allocation.

### 5. Transparent Status Flow
Each issue follows a strict lifecycle:
