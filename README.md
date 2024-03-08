# MVP

## Releases

![GitHub Release](https://img.shields.io/github/v/release/farmacodeunipd/mvp/develop)

## Docker

L'integrazione delle varie componenti del prodotto è gestito interamente tramite l'uso di alcuni container docker realizzati ad hoc. L'utilizzo di docker facilità inoltre il rilascio del software, sul repository sono infatti disponibili tutte le versione delle [immagini](https://github.com/farmacodeunipd?tab=packages&repo_name=poc) per poter ricreare i container in qualsiasi ambiente. Il progetto si suddivide in 4 container differenti:

- **db (container adibito al database)**;
- **python-api (container adibito alle api che espongo l'algotirmo di raccomandazione)**;
- **express (container adibito alle api che permettono la comunicazione tra db e web-app)**;
- **react-app (container adibito all'hosting del client web)**.

## Testing

Per la realizzazione e integrazione dei test (dinamici) automatici sono stati individuati e scelti questi due servizi:

- **[Pytest](https://docs.pytest.org/en/8.0.x/) (per la relaizzazione dei test del codice realizzato in python)**
- **[Jest](https://jestjs.io/) (per la realizzazione dei test del codice realizzato in js e react)**

### Code coverage

[![codecov](https://codecov.io/gh/farmacodeunipd/poc/graph/badge.svg?token=BECENNCPRE)](https://codecov.io/gh/farmacodeunipd/poc)

Maggiori informazioni sono disponibili al link: [Codecov repo](https://app.codecov.io/gh/farmacodeunipd/poc?search=&displayType=tree)

### Sunburst graph

![Coverage grah](https://codecov.io/gh/farmacodeunipd/poc/graphs/sunburst.svg?token=BECENNCPRE)

#### Descrizione
Il cechio centrale rappresenta il progetto nella sua totalità, spostandosi verso l'esterno ci sono le directory, e infine, i singoli file. La grandezza e il colore di ogni "slice" (o spicchio) rappresenta rispettivamente il numero di statements e il coverage.

## Developers only

In questa sezione sono reperibili informazioni utili agli sviluppatori del software. 

### GitHub Action workflow walkthrough

```yaml
name: Docker Image Release


on:
  push:
    branches:
      - main

jobs:
  release-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Set Git user
        run: |
          git config --global user.name "farmacodeunipd"
          git config --global user.email "farmacode.swe.unipd@gmail.com"

      - name: Checkout repository
        uses: actions/checkout@v2
        with:
          fetch-depth: 0

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Fetch Tags
        run: git fetch --tags

      - name: Get Version
        id: versioning
        run: |
          if [[ $(git tag) ]]; then
            LAST_TAG=$(git describe --tags --abbrev=0)
          else
            LAST_TAG="v0.0.0"
            git tag $LAST_TAG
            git push --tags
          fi

          echo "Last Tag: $LAST_TAG"

          IFS='.' read -ra VERSION_PARTS <<< "$LAST_TAG"
          MAJOR="${VERSION_PARTS[0]#v}"
          MID="${VERSION_PARTS[1]}"
          MINOR="${VERSION_PARTS[2]}"

          if git log --format=%B -n 1 $GITHUB_SHA | grep -q "version-major"; then
            echo "Version Major Detected"
            ((MAJOR+=1))
            MID=0
            MINOR=0
          elif git log --format=%B -n 1 $GITHUB_SHA | grep -q "version-mid"; then
            echo "Version Mid Detected"
            ((MID+=1))
            MINOR=0
          elif git log --format=%B -n 1 $GITHUB_SHA | grep -q "version-minor"; then
            echo "Version Minor Detected"
            ((MINOR+=1))
          fi

          echo "creating new version ..."

          UPDATED_VERSION="v${MAJOR}.${MID}.${MINOR}"
          echo "Updated Version: $UPDATED_VERSION"
          echo "::set-output name=updated_version::$UPDATED_VERSION"
          
        env:
          GITHUB_SHA: ${{ github.sha }}

      - name: Log in to GitHub Packages
        run: echo "${{ secrets.PAT }}" | docker login docker.pkg.github.com -u farmacodeunipd --password-stdin

      - name: Set up Docker Compose
        run: docker-compose up -d

      - name: Run tests and stop if they do not pass
        run: |
          ci_env=$(bash <(curl -s https://codecov.io/env))
          docker exec $ci_env poc_python-api_1 pytest tests/test_algo.py --cov=. --cov-report=xml:/tests/coverage.xml --verbose
          docker exec $ci_env poc_react-app_1 npm test
          docker exec $ci_env poc_express_1 npm test

      - name: Check test status
        run: |
          if [ ${{ steps.test.outcome }} == 'failure' ]; then
            echo "Tests failed, aborting the workflow."
            exit 1
          else
            echo "Tests passed, continuing with the workflow."
          fi

      - name: Copy coverage reports
        run: |
          docker cp poc_python-api_1:/tests/coverage.xml ./coverage-python-api.xml
          docker cp poc_react-app_1:/client/coverage/coverage-final.json ./coverage-react.json
          docker cp poc_express_1:/express/coverage/coverage-final.json ./coverage-express.json

      - name: Upload Python API coverage report to Codecov
        uses: codecov/codecov-action@v4.0.1
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage-python-api.xml
          flags: python-api
          name: codecov-python-api

      - name: Upload React application coverage report to Codecov
        uses: codecov/codecov-action@v4.0.1
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage-react.json
          flags: react-app
          name: codecov-react-app

      - name: Upload Express coverage report to Codecov
        uses: codecov/codecov-action@v4.0.1
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          file: ./coverage-express.json
          flags: express
          name: codecov-express

      - name: Push Docker images
        run: |
          docker images
          IMAGES=("poc_db" "poc_python-api" "poc_react-app" "poc_express")
          for IMAGE in "${IMAGES[@]}"; do
            docker tag $IMAGE docker.pkg.github.com/farmacodeunipd/poc/$IMAGE:${{ steps.versioning.outputs.updated_version }}
            docker push docker.pkg.github.com/farmacodeunipd/poc/$IMAGE:${{ steps.versioning.outputs.updated_version }}
            
            docker tag $IMAGE docker.pkg.github.com/farmacodeunipd/poc/$IMAGE:latest
            docker push docker.pkg.github.com/farmacodeunipd/poc/$IMAGE:latest
          done

      - name: Stop and remove Docker containers
        run: docker-compose down

      - name: Check if release already exists
        id: check_release
        run: |
          VERSION="${{ steps.versioning.outputs.updated_version }}"
          if curl -s -o /dev/null -I -w "%{http_code}" https://api.github.com/repos/farmacodeunipd/poc/releases/tags/${VERSION}; then
            echo "Release already exists for version ${VERSION}"
            echo "::set-output name=release_exists::true"
          else
            echo "Release does not exist for version ${VERSION}"
            echo "::set-output name=release_exists::false"
          fi

      - name: Create GitHub Release
        if: steps.check_release.outputs.release_exists != 'true'
        uses: actions/create-release@v1
        with:
          tag_name: ${{ steps.versioning.outputs.updated_version }}
          release_name: Release ${{ steps.versioning.outputs.updated_version }}
          body: |
            Release ${{ steps.versioning.outputs.updated_version }}
        env:
          GITHUB_TOKEN: ${{ secrets.PAT }}

```

**Overview**:
- Trigger: Il workflow viene attivato ad ogni push sul ramo principale (main).

- Lavori (Jobs): Il workflow consiste in un unico lavoro chiamato "release-and-test", che viene eseguito su un ambiente Ubuntu latest.

**Steps**:
- Imposta l'utente Git: Configura l'utente Git globale utilizzando il nome utente e l'email forniti.
- Checkout del repository: Esegue il checkout del codice del repository per eseguire le azioni successive.
- Imposta Docker Buildx: Configura Docker Buildx, un plugin Docker CLI per estendere le capacità di build.
- Recupera i tag: Recupera i tag dal repository.
- Ottieni la versione: Determina la versione aggiornata basata sull'ultimo tag e sui commit. Se viene trovata una specifica parola chiave nel messaggio del commit (version-major, version-mid o version-minor), incrementa la parte di versione corrispondente.
- Accedi a GitHub Packages: Effettua l'accesso al registro Docker di GitHub Packages per caricare le immagini Docker.
- Imposta Docker Compose: Configura Docker Compose per gestire più container Docker.
- Esegui i test e interrompi se non passano: Esegue i test per diversi servizi (API Python, app React, Express) all'interno dei container Docker. Il workflow si interrompe se i test non passano.
- Copia i report di copertura: Copia i report di copertura generati dai test dai container Docker alla macchina locale.
- Carica i report di copertura su Codecov: Carica i report di copertura su Codecov per ciascun servizio (API Python, app React, Express).
- Carica le immagini Docker: Etichetta le immagini Docker con la versione aggiornata e le carica nel registro Docker di GitHub Packages.
- Interrompi e rimuovi i container Docker: Interrompe e rimuove i container Docker creati da Docker Compose.
- Controlla se il rilascio esiste già: Verifica se esiste già un rilascio per la versione aggiornata su GitHub.
- Crea il rilascio GitHub: Crea un nuovo rilascio su GitHub se non esiste già per la versione aggiornata.
- Esecuzione Condizionale: Il passaggio per creare un rilascio su GitHub viene eseguito in modo condizionale solo se un rilascio per la versione aggiornata non esiste già.

Questo workflow automatizza il versioning, i test e il processo di rilascio delle immagini Docker, garantendo rilasci consistenti e affidabili per il progetto.

### Local testing
Per eseguire i test localmente nelle propria macchina basta seguire le seguenti istruzioni:

Prima di tutto bisogna azionare il container Docker:
```bash
docker-compose up
```
E' possibile anche reperire l'ultima versione delle immagini dal repository del progetto, per velocizzare così il processo:
```bash
docker pull docker.pkg.github.com/farmacodeunipd/poc/poc_db:${{ steps.versioning.outputs.updated_version }}
docker pull docker.pkg.github.com/farmacodeunipd/poc/poc_python-api:${{ steps.versioning.outputs.updated_version }}
docker pull docker.pkg.github.com/farmacodeunipd/poc/poc_react-app:${{ steps.versioning.outputs.updated_version }}
docker pull docker.pkg.github.com/farmacodeunipd/poc/poc_express:${{ steps.versioning.outputs.updated_version }}

```
Una volta che il container e tutte le sue immagini hanno concluso il loro avvio, sarà possibili testare i vari servizi con i rispettivi comandi:

- Python-api (Algoritmo e relative API):
    ```bash
        docker exec poc-python-api-1 pytest --verbose
    ``` 
- React-app (Client web):
    ```bash
        docker exec poc-react-app-1 npm test
    ```
- Express (API per la connesione tra db e client):
    ```bash
        docker exec poc-express-1 npm test
    ``` 
