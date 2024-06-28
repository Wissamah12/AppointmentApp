import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { getMarkedDates, getTodayString } from "@/utlis/getTodayString";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Appointment = {
  id: string;
  firstName: string;
  lastName: string;
  date: string;
  time: string;
};

type Props = {
  navigateToAppointmentForm: (date: string) => void;
};

const CalendarPage: React.FC<Props> = ({ navigateToAppointmentForm }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch("http://192.168.0.110:5000/api/appointments") 
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error);
      });
  }, []);
  const onDayPress = async (day: DateData) => {
    navigateToAppointmentForm(day.dateString);
    await AsyncStorage.removeItem("appointmentId");
  };

  const editAppointment = async (appointmentId: string) => {
    try {
      await AsyncStorage.setItem("appointmentId", appointmentId);
      navigateToAppointmentForm("");
    } catch (error) {
      console.error("Failed to save appointment ID to AsyncStorage:", error);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(
        `http://192.168.0.110:5000/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      // Update state to remove the deleted appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((apt) => apt.id !== appointmentId)
      );

      Alert.alert(
        "Appointment Deleted",
        "Your appointment has been deleted successfully!"
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // Handle error deleting appointment
    }
  };
  const renderItem = ({ item }: { item: Appointment }) => (
    <View style={styles.appointmentItem} key={item.id}>
      <Text
        style={styles.NameText}
      >{`${item.firstName} ${item.lastName}`}</Text>
      <Text style={styles.DateTimeText}>{`${item.date} - ${item.time}`}</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => editAppointment(item.id)}
        >
          <Text style={styles.flatText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => deleteAppointment(item.id)}
        >
          <Text style={styles.flatText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={getMarkedDates()} // Call function to get marked dates
        minDate={getTodayString()} // Call function to get today's date in string format
      />
      <Text style={styles.sectionTitle}>Appointments</Text>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  flatList: {
    flexGrow: 0,
    marginBottom: 20,
  },
  appointmentItem: {
    backgroundColor: "#c6ced83d",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  iconButton: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  flatText: {
    color: "white",
    fontSize: 15,
  },
  NameText: { fontSize: 15, marginBottom: 10 },
  DateTimeText: {
    fontSize: 15,
  },
});

export default CalendarPage;
