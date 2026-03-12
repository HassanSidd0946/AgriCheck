# from sqlalchemy import Column, Integer, Float, DateTime
# from sqlalchemy.sql import func
# from .database import Base

# class SensorReading(Base):
#     __tablename__ = "sensor_readings"

#     id = Column(Integer, primary_key=True, index=True)
#     nitrogen = Column(Float, nullable=False)
#     phosphorus = Column(Float, nullable=False)
#     potassium = Column(Float, nullable=False)
#     ph = Column(Float, nullable=False)
#     temperature = Column(Float, nullable=False)
#     humidity = Column(Float, nullable=False)
#     ec = Column(Float, nullable=False)
#     timestamp = Column(DateTime(timezone=True), server_default=func.now())


from sqlalchemy import Column, Integer, Float, DateTime
from sqlalchemy.sql import func
from datetime import datetime
from .database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    ec = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), default=datetime.utcnow)  # ✅ Added default
