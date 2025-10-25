This folder contains a PlantUML diagram representing the backend architecture.

To render the diagram to PNG or SVG you can use PlantUML CLI, VS Code PlantUML extension, or online renderers.

Example using PlantUML Docker (recommended if you don't have Java):

```bash
# Render to PNG
docker run --rm -v "$PWD":/workspace plantuml/plantuml -tpng backend/architecture/backend.puml

# Render to SVG
docker run --rm -v "$PWD":/workspace plantuml/plantuml -tsvg backend/architecture/backend.puml
```

Or with the PlantUML jar (requires Java):

```bash
java -jar plantuml.jar -tpng backend/architecture/backend.puml
```

Or install the VS Code PlantUML extension and open the `.puml` file; the extension will show live preview and export options.
