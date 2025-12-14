from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import date

class User(BaseModel):
    id: Optional[str]
    username: str
    password: str
    role: str
    name: str
    email: EmailStr

class Patient(BaseModel):
    id: Optional[str]
    name: str
    dob: date
    gender: str
    contact: Optional[str]
    email: Optional[EmailStr]
    address: Optional[str]
    medicalHistory: List[str] = []

class Doctor(BaseModel):
    id: Optional[str]
    name: str
    specialization: str
    contact: Optional[str]
    email: Optional[EmailStr]
    clinic: Optional[str]

class Appointment(BaseModel):
    id: Optional[str]
    patient: str
    doctor: str
    date: date
    time: str
    status: str = "scheduled"
    notes: Optional[str]

class Clinic(BaseModel):
    id: Optional[str]
    name: str
    address: Optional[str]
    contact: Optional[str]
    email: Optional[EmailStr]

class Treatment(BaseModel):
    id: Optional[str]
    patient: str
    doctor: str
    description: str
    date: date
    cost: Optional[float]

class Report(BaseModel):
    id: Optional[str]
    patient: str
    doctor: str
    reportType: str
    content: str
    date: date
