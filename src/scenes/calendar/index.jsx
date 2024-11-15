import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "axios";

const Calendar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentEvents, setCurrentEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/events");
        setCurrentEvents(res.data);
      } catch (error) {
        console.error("Error del servidor:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleDateClick = async (selected) => {
    const title = prompt("Escribe un nombre para este evento");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };

      try {
        const res = await axios.post("http://localhost:5000/events", newEvent);
        const savedEvent = res.data;
        calendarApi.addEvent({
          id: savedEvent.id,
          title: savedEvent.title,
          start: savedEvent.start,
          end: savedEvent.end,
          allDay: savedEvent.allDay,
        });
      } catch (error) {
        console.error("Error al guardar el evento:", error);
      }
    }
  };

  const handleEventClick = async (selected) => {
    if (
      window.confirm(`Seguro de eliminar el evento '${selected.event.title}'?`)
    ) {
      try {
        await axios.delete(`http://localhost:5000/events/${selected.event.id}`);
        selected.event.remove();
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  return (
    <Box m="30px">
      <Header
        title="CALENDARIO"
        subtitle="Pagina interactiva para eventos importantes"
      />

      <Box display="flex" justifyContent="space-between" width="166vh">
        {/* SIDEBAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="6px"
        >
          <Typography variant="h5">Eventos</Typography>
          <List>
            {currentEvents.map((event) => (
              <ListItem
                key={event.id}
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  margin: "10px 0",
                  borderRadius: "4px",
                }}
              >
                <ListItemText
                  primary={event.title}
                  secondary={
                    <Typography>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* CALENDARIO PROPIO */}
        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            locale={esLocale}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={handleEventClick}
            events={currentEvents}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
