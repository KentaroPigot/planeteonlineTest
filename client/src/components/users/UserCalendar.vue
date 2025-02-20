<template>
  <div class="h-100" style="min-height: 400px">
    <div class="position-absolute top-0 start-0 end-0 bottom-0 p-1">
      <div class="table calendar-table">
        <!-- Colonnes horaires -->
        <div
          class="calendar-row"
          v-for="hour in hours"
          :key="hour.label"
          :style="{ height: `${hourHeight}px` }"
        >
          <div class="calendar-time">{{ hour.label }}</div>
          <div class="calendar-slot"></div>
        </div>

        <!-- Tâches -->
        <div
          class="task rounded text-white text-center"
          v-for="task in userTasks"
          :key="task.libelle"
          :style="getTaskStyle(task)"
        >
          <strong>{{ task.libelle }}</strong>
          <div>{{ task.startTime }} - {{ task.endTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import useUserStore from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()
    const userTasks = computed(() => userStore.userTasks)

    // Défini une liste de 11 heures. de 8 à 19, plus jolie
    const hours = ref(
      Array.from({ length: 11 }, (_, i) => {
        const hour = i + 8 // Plage horaire : 8h à 18h
        return {
          label: `${hour.toString().padStart(2, '0')}:00`,
          value: hour,
        }
      }),
    )

    // Hauteur d'une heure en pixels
    const hourHeight = 45

    const getTaskStyle = (task) => {
      const [startHour, startMinute] = task.startTime.split(':').map((value) => Number(value))
      const [endHour, endMinute] = task.endTime.split(':').map((value) => Number(value))

      // On converti le tout en minutes seulement.
      const startInMinutes = startHour * 60 + startMinute
      const endInMinutes = endHour * 60 + endMinute

      // Calculer la position dans la plage horaire (8h à 18h)
      const calendarStartInMinutes = 8 * 60

      // On convertit en heure puis on multiplie par la taille d'une heure pour être à l'échelle
      const top = ((startInMinutes - calendarStartInMinutes) / 60) * hourHeight
      const height = ((endInMinutes - startInMinutes) / 60) * hourHeight

      return {
        backgroundColor: '#007bff',
        position: 'absolute',
        top: `${top}px`,
        zIndex: 10,
        right: '0',
        height: `${height}px`,
        width: '75%',
      }
    }

    return {
      hours,
      hourHeight,
      userTasks,
      getTaskStyle,
    }
  },
}
</script>

<style scoped>
.table {
  margin-bottom: 0 !important;
}

.calendar-table {
  min-width: 250px;
  position: relative;
  border-left: 2px solid #dee2e6;
}

.calendar-row {
  position: relative;
  display: flex;
  align-items: center;
  border-top: 1px solid #dee2e6;
}

.calendar-time {
  position: absolute;
  font-size: 0.8rem;
  top: 0;
  padding: 5px;
  left: 0;
  font-weight: bold;
  color: #495057;
}

.calendar-slot {
  flex: 1;
  height: 100%;
}

.task {
  font-size: 0.85rem;
  position: absolute;
  line-height: 1.2;
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
</style>
