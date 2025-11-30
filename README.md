# API Docs: http://localhost:8000/docs
```

### Opción 2: Desarrollo Local

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📚 Documentación

- **Frontend**: Ver [frontend/README.md](./frontend/README.md)
- **Backend**: Ver [backend/README.md](./backend/README.md)
- **API Docs**: http://localhost:8000/docs (cuando el backend esté corriendo)

## 🔧 Stack Tecnológico

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM
- Recharts (gráficos)
- Context API (estado global)

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy (ORM)
- Alembic (migraciones)
- JWT (autenticación)
- Pydantic (validación)

## 👥 Usuarios de Prueba

```
Admin:
  username: admin
  password: admin123

Técnico:
  username: tech
  password: tech123
```

## 📝 Estado del Proyecto

Ver [task.md](./.gemini/antigravity/brain/42fa52a3-9c3d-410d-8748-13f710ffee38/task.md) para el progreso detallado del desarrollo.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.