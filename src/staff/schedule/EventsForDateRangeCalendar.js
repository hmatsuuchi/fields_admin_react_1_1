import { useEffect } from "react";
// Axios
import instance from "../../staff/axios/axios_authenticated";
// CSS
import "./EventsForDateRangeCalendar.scss";

function EventsForDateRangeCalendar() {
  useEffect(() => {
    // fetches event data from API
    const fetchEventsForDateRange = async () => {
      try {
        await instance.get("api/schedule/events/").then((response) => {
          if (response) {
            console.log(response.data);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    fetchEventsForDateRange();
  }, []);
}

export default EventsForDateRangeCalendar;
