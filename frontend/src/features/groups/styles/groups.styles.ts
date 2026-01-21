/**
 * Estilos del módulo de Grupos
 *
 * Todas las clases CSS están aquí, separadas del componente.
 * Fácil de mantener y actualizar el diseño.
 */

export const groupsStyles = `
  /* ========================================
     CONTENEDORES Y CAJAS
     ======================================== */
  
  .groups-wrapper {
    padding-top: 15px;
  }

  .section-box {
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    background-color: #fafafa;
    margin-bottom: 10px;
    transition: all 0.3s ease;
  }

  .section-box:hover {
    border-color: #d0d0d0;
    background-color: #f5f5f5;
  }

  .section-box h5 {
    margin-top: 0;
    margin-bottom: 12px;
    color: #333;
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  /* ========================================
     LISTAS
     ======================================== */

  .members-list {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .members-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .members-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 3px;
    margin-bottom: 5px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    transition: all 0.2s ease;
  }

  .members-list li:hover {
    background-color: #fff;
    border-color: #b3b3b3;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  /* Coach list styling */
  .coaches-list li {
    background-color: #fef8f0;
    border-color: #ffd9b3;
  }

  .coaches-list li:hover {
    background-color: #fff;
    border-color: #ffb366;
  }

  /* Athlete list styling */
  .athletes-list li {
    background-color: #f0f7ff;
    border-color: #b3d9ff;
  }

  .athletes-list li:hover {
    background-color: #fff;
    border-color: #66b3ff;
  }

  /* ========================================
     HORARIOS
     ======================================== */

  .schedule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border-radius: 3px;
    margin-bottom: 5px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    transition: all 0.2s ease;
  }

  .schedule-item:hover {
    background-color: #fff;
    border-color: #999;
  }

  /* ========================================
     MODAL - EDITAR HORARIOS
     ======================================== */

  .schedule-row {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .schedule-row-day {
    flex: 0 1 120px;
  }

  .schedule-row-time {
    flex: 0 1 110px;
  }

  .schedule-modal-container {
    max-height: 400px;
    overflow-y: auto;
    padding-bottom: 10px;
  }

  /* ========================================
     UTILIDADES
     ======================================== */

  .mb-3 {
    margin-bottom: 20px;
  }

  .ml-2 {
    margin-left: 8px;
  }

  .mt-3 {
    margin-top: 15px;
  }

  /* ========================================
     BADGES
     ======================================== */

  .badge {
    padding: 4px 8px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: bold;
    display: inline-block;
    margin-left: 6px;
  }

  .badge-info {
    background-color: #17a2b8;
    color: white;
  }

  .badge-primary {
    background-color: #007bff;
    color: white;
  }

  .badge-secondary {
    background-color: #6c757d;
    color: white;
  }

  /* ========================================
     EXPANDIBLE (CHEVRON)
     ======================================== */

  .group-toggle-btn {
    text-align: left;
    padding: 0;
    text-decoration: none;
    cursor: pointer;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
  }

  .group-toggle-btn:focus {
    outline: none;
  }

  .group-toggle-btn h4 {
    display: inline;
    margin: 0;
    margin-left: 8px;
  }

  .chevron-icon {
    margin-right: 8px;
    transition: transform 0.2s ease;
  }

  /* ========================================
     RESPONSIVE
     ======================================== */

  @media (max-width: 768px) {
    .schedule-row {
      flex-direction: column;
    }

    .schedule-row-day,
    .schedule-row-time {
      flex: 1 1 100%;
    }

    .members-list {
      max-height: 200px;
    }

    .section-box {
      padding: 12px;
    }
  }
`;
