import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useFormik } from "formik";
import * as yup from "yup";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// icon
import Icon from "react-native-vector-icons/MaterialIcons";

type Appointment = {
  id: string;
  firstName: string;
  lastName: string;
  date: string;
  time: string;
};
type Props = {
  date: string;
  navigateBack: () => void;
};

const AppointmentPage: React.FC<Props> = ({ date, navigateBack }) => {
  const [SelectedAppointment, setSelectedAppointments] =
    useState<Appointment>();
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  function generateRandomObjectId(length: number) {
    const characters = "abcdef0123456789";
    let objectId = "";
    for (let i = 0; i < length; i++) {
      objectId += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return objectId;
  }
  useEffect(() => {
    const fetchAppointmentId = async () => {
      try {
        const id = await AsyncStorage.getItem("appointmentId");
        if (id) {
          const response = await fetch(
            `http://192.168.0.110:5000/api/appointments/${id}`
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setSelectedAppointments(data);
          formik.setValues(data);
        }
      } catch (error) {
        console.error(
          "Failed to retrieve appointment ID from AsyncStorage:",
          error
        );
      }
    };

    fetchAppointmentId();
  }, []);

  const randomId = generateRandomObjectId(24);

  const formik = useFormik({
    initialValues: {
      id: randomId,
      firstName: "",
      lastName: "",
      time: "",
      date: date,
    },
    validationSchema: yup.object().shape({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      time: yup.string().required("Time is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (SelectedAppointment?.id) {
          // Update existing appointment
          await axios.put(
            `http://192.168.0.110:5000/api/appointments/${SelectedAppointment.id}`,
            values
          );
          Alert.alert(
            "Appointment Updated",
            "Your appointment has been updated successfully!"
          );
        } else {
          // Create new appointment
          await axios.post(
            "http://192.168.0.110:5000/api/appointments",
            values
          );

          Alert.alert(
            "Appointment Created",
            "Your appointment has been created successfully!"
          );
        }

        navigateBack();
      } catch (error) {
        console.error("Error saving appointment:", error);
        Alert.alert("Error", "Failed to save appointment. Please try again.");
        console.log("Formik values:", values);
      }
    },
  });

  const handleConfirm = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      const timeString = selectedTime.toLocaleTimeString();
      formik.setFieldValue("time", timeString);
      setTimePickerVisibility(false);
    }
  };

  useEffect(() => {
    // editing the appointment
    if (SelectedAppointment) {
      formik.setValues({
        id: SelectedAppointment.id,
        firstName: SelectedAppointment.firstName,
        lastName: SelectedAppointment.lastName,
        date: SelectedAppointment.date,
        time: SelectedAppointment.time,
      });
    } else {
      formik.setValues({
        id: randomId,
        firstName: "",
        lastName: "",
        date: date,
        time: "",
      });
    }
  }, [SelectedAppointment]);

  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={navigateBack}>
        <Icon name={"arrow-back"} size={35} color="#007BFF" />
      </TouchableOpacity>
      <View style={styles.appointmentIcon}>
        <Icon name="event" size={100} color="#007BFF" />
      </View>
      <View style={styles.container}>
        <TextInput
          placeholder="First Name"
          value={formik.values.firstName}
          onChangeText={formik.handleChange("firstName")}
          onBlur={formik.handleBlur("firstName")}
          style={[
            styles.input,
            formik.touched.firstName && formik.errors.firstName
              ? styles.errorBorder
              : null,
          ]}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <Text style={styles.errorText}>{formik.errors.firstName}</Text>
        )}
        <TextInput
          placeholder="Last Name"
          value={formik.values.lastName}
          onChangeText={formik.handleChange("lastName")}
          onBlur={formik.handleBlur("lastName")}
          style={[
            styles.input,
            formik.touched.lastName && formik.errors.lastName
              ? styles.errorBorder
              : null,
          ]}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <Text style={styles.errorText}>{formik.errors.lastName}</Text>
        )}
        <TextInput
          placeholder="Date"
          value={formik.values.date}
          onChangeText={formik.handleChange("date")}
          editable={SelectedAppointment?.id ? true : false}
          style={styles.input}
        />
        <View style={styles.timePickerContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setTimePickerVisibility(true)}
          >
            <Text style={styles.buttonText}>Select Time</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Time"
            value={formik.values.time}
            editable={formik.values.time ? true : false}
            onChangeText={formik.handleChange("time")}
            style={styles.input}
          />
          {isTimePickerVisible && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleConfirm}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => formik.handleSubmit()}
        >
          <Text style={styles.buttonText}>
            {SelectedAppointment?.id
              ? "Update Appointment"
              : "Save Appointment"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    backgroundColor: "#f0f0",
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "100%",
  },
  errorBorder: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  timePickerContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "relative",
    top: 0,
    left: 10,
    justifyContent: "center",
    height: 50,
  },
  appointmentIcon: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
});

export default AppointmentPage;
