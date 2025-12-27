<template>
  <section class="team-section">
    <div class="container">
      <h2 class="section-title">The Team</h2>
      <p class="section-subtitle">A dedicated group of data enthusiasts and urban researchers.</p>
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.name" class="team-member">
          <img :src="member.photo" :alt="member.name" class="member-photo" />
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AboutTeam",

  data() {
    return {
      teamMembers: [
        { name: "Team Member 1", role: "Data Analyst", photo: "/images/logo.png" },
        { name: "Team Member 2", role: "UX Designer", photo: "/images/logo.png" },
        { name: "Team Member 3", role: "Developer", photo: "/images/logo.png" },
        { name: "Team Member 4", role: "Researcher", photo: "/images/logo.png" },
      ],
    }
  },
}
</script>

<style scoped>
.team-section {
  padding: 3rem 0;
  background: #fff;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1a1a2e;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.section-subtitle {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.85rem;
  color: #6c757d;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.team-member {
  text-align: center;
}

.member-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 0.75rem;
  border: 3px solid #e8f1fc;
  transition: all 0.25s ease;
}

.team-member:hover .member-photo {
  border-color: #75aff0;
  transform: scale(1.05);
}

.member-name {
  font-family: "Kanit", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a2e;
  margin: 0 0 0.2rem 0;
}

.member-role {
  font-family: "Kanit", sans-serif;
  font-weight: 300;
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0;
}

@media (max-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
