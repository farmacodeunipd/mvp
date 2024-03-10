# MVP

## Releases

![GitHub Release](https://img.shields.io/github/v/release/farmacodeunipd/mvp)

Il versionamento del prodotto è eseguito in modo automatico tramite l'uso di GitHub Action realizzate appositamente. Ogni versione è corredata da una breve descrizione stilata anch'essa in modo automatico trasformando i messaggi di commit registrati durante lo sviluppo di quella determinata versione, in un vero e proprio registro delle modifiche (contenente ad esempio l'aggiunta di nuove feature, la risoluzione di problematiche e/o migliorie e modifiche più generiche).

Il numero di versione è suddiviso in tre digit: (nel formato v.x.y.z)
- x: questo digit rappresenta una nuova versione (major) e viene incrementato a discrezione degli sviluppatori una volta che lo ritengano necessario e ragionevole;
- y: rappresenta l'aggiunta di una nuova feature principale o la modifica/correzione di un intera componente del prodotto (mid);
- z: rappresenta la correzione di un bug o il miglioramento di una feature già esistente (minor).

## Docker

L'integrazione delle varie componenti del prodotto è gestito interamente tramite l'uso di alcuni container docker realizzati ad hoc. L'utilizzo di docker facilità inoltre il rilascio del software, sul repository sono infatti disponibili tutte le versione delle [immagini](https://github.com/farmacodeunipd?tab=packages&repo_name=mvp) per poter ricreare i container in qualsiasi ambiente. Il progetto si suddivide in 4 container differenti:

- **db (container adibito al database)**;
- **python-api (container adibito alle api che espongo l'algotirmo di raccomandazione)**;
- **express (container adibito alle api che permettono la comunicazione tra db e web-app)**;
- **react-app (container adibito all'hosting del client web)**.

## Testing
Per quanto rigurda l'analisi statica del codice sono stati integrati strumenti automatici quali:

- **[Ruff](https://docs.astral.sh/ruff/) (per il codice realizzato in python)**
- **[ESLint](https://eslint.org/) (per il codice realizzato in js e react)**

Per la realizzazione e integrazione dei test (dinamici) automatici sono stati individuati e scelti questi due servizi:

- **[Pytest](https://docs.pytest.org/en/8.0.x/) (per la relaizzazione dei test del codice realizzato in python)**
- **[Jest](https://jestjs.io/) (per la realizzazione dei test del codice realizzato in js e react)**

### Code coverage

[![codecov](https://codecov.io/gh/farmacodeunipd/mvp/graph/badge.svg?token=CP0VPR2TT5)](https://codecov.io/gh/farmacodeunipd/mvp)

Maggiori informazioni sono disponibili al link: [Codecov repo](https://app.codecov.io/gh/farmacodeunipd/mvp?search=&displayType=tree)

### Sunburst graph

![Coverage grah](https://codecov.io/gh/farmacodeunipd/mvp/graphs/sunburst.svg?token=CP0VPR2TT5)

#### Descrizione

Il cechio centrale rappresenta il progetto nella sua totalità, spostandosi verso l'esterno ci sono le directory, e infine, i singoli file. La grandezza e il colore di ogni "slice" (o spicchio) rappresenta rispettivamente il numero di statements e il coverage.

## GitHub Action

### Workflow walkthrough

**Develop branch**:

- **linting.yml**

```yaml
name: Python and React/JS application

on:
  push:
    branches:
      - develop
    paths:
      - '**.py'
      - '**.js'
      - '**.jsx'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python 3.11.5
        uses: actions/setup-python@v4
        with:
          python-version: "3.11.5"

      - name: Install dependencies
        run: |
          pip install ruff
          npm install eslint eslint-plugin-react
          npx eslint . --fix

      - name: Lint with Ruff (Python)
        run: |
          ruff check . --fix
          ruff format .

      - name: Lint with ESLint (React/JS)
        run: |
          npx eslint . --fix

```
**Overview**:

**Trigger:** 
Il workflow è configurato per essere attivato ogni volta che viene effettuato un push sul ramo "develop" e quando vengono apportate modifiche ai file con estensione .py, .js o .jsx.

**Steps:**
- Checkout del codice: Questo passaggio utilizza l'azione actions/checkout@v4 per ottenere una copia del repository.
- Configurazione di Python 3.11.5: Viene utilizzata l'azione actions/setup-python@v4 per configurare l'ambiente Python con la versione 3.11.5.
- Installazione delle dipendenze: In questo passaggio vengono installati i pacchetti necessari sia per Python che per JavaScript. Per Python, viene utilizzato pip install ruff per installare Ruff, mentre per JavaScript vengono utilizzati npm install eslint eslint-plugin-react per installare ESLint e il plugin per React. Successivamente, viene eseguito npx eslint . --fix per correggere eventuali problemi di stile nel codice JavaScript.
- Analisi statica con Ruff (Python): Viene eseguita un'analisi statica del codice Python utilizzando Ruff. I comandi ruff check . --fix e ruff format . vengono utilizzati per controllare e formattare il codice Python.
- Analisi statica con ESLint (React/JS): Infine, viene eseguita un'analisi statica del codice React/JS utilizzando ESLint tramite il comando npx eslint . --fix. Questo passaggio controlla e corregge eventuali problemi di stile nel codice JavaScript e React.

In sintesi, questo workflow si occupa di controllare la qualità del codice Python e JavaScript/React attraverso analisi statiche e correzioni automatiche dei problemi di stile.

- **test-and-release.yml**

```yaml
name: Docker Image Release

on:
  pull_request:
    branches:
      - main

jobs:
  test-and-release:
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
            LAST_TAG=$(git tag --sort=-v:refname | head -n1)
            echo "::set-output name=last_tag::$LAST_TAG"
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

          echo $(git log --format=%B -n 1 $(git rev-list --no-merges -n 1 HEAD))

          if git log --format=%B -n 1 $(git rev-list --no-merges -n 1 HEAD) | grep -q "version-major"; then
            echo "Version Major Detected"
            ((MAJOR+=1))
            MID=0
            MINOR=0
          elif git log --format=%B -n 1 $(git rev-list --no-merges -n 1 HEAD) | grep -q "version-mid"; then
            echo "Version Mid Detected"
            ((MID+=1))
            MINOR=0
          elif git log --format=%B -n 1 $(git rev-list --no-merges -n 1 HEAD) | grep -q "version-minor"; then
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
          docker exec $ci_env mvp_python-api_1 pytest tests/test_algo.py --cov=. --cov-report=xml:/tests/coverage.xml --verbose
          docker exec $ci_env mvp_react-app_1 npm test
          docker exec $ci_env mvp_express_1 npm test
        continue-on-error: false

      - name: Copy coverage reports
        run: |
          docker cp mvp_python-api_1:/tests/coverage.xml ./coverage-python-api.xml
          docker cp mvp_react-app_1:/client/coverage/coverage-final.json ./coverage-react.json
          docker cp mvp_express_1:/express/coverage/coverage-final.json ./coverage-express.json

      - name: Stop and remove Docker containers
        run: docker-compose down

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
          IMAGES=("mvp_db" "mvp_python-api" "mvp_react-app" "mvp_express")
          for IMAGE in "${IMAGES[@]}"; do
            # Controllo se l'immagine è stata modificata confrontando l'hash SHA locale con quello remoto
            LOCAL_SHA=$(docker inspect --format='{{index .RepoDigests 0}}' $IMAGE)
            REMOTE_SHA=$(docker run --rm docker.pkg.github.com/farmacodeunipd/mvp/$IMAGE:${{ steps.versioning.outputs.updated_version }} sha256sum /)
            
            if [ "$LOCAL_SHA" != "$REMOTE_SHA" ]; then
              # L'immagine è stata modificata, la etichetto e la pusho
              docker tag $IMAGE docker.pkg.github.com/farmacodeunipd/mvp/$IMAGE:${{ steps.versioning.outputs.updated_version }}
              docker push docker.pkg.github.com/farmacodeunipd/mvp/$IMAGE:${{ steps.versioning.outputs.updated_version }}
              
              docker tag $IMAGE docker.pkg.github.com/farmacodeunipd/mvp/$IMAGE:latest
              docker push docker.pkg.github.com/farmacodeunipd/mvp/$IMAGE:latest
            else
              echo "L'immagine $IMAGE non è stata modificata. Salto il push."
            fi
          done
          
      - name: Check if release already exists
        id: check_release
        run: |
          VERSION="${{ steps.versioning.outputs.updated_version }}"
          echo "Checking release for version ${VERSION}"
          response=$(curl -s -o /dev/null -I -w "%{http_code}" https://api.github.com/repos/farmacodeunipd/mvp/releases/tags/${VERSION})
          echo "Response code: $response"
          if [[ $response -eq 200 ]]; then
            echo "Release already exists for version ${VERSION}"
            echo "::set-output name=release_exists::true"
          else
            echo "Release does not exist for version ${VERSION}"
            echo "::set-output name=release_exists::false"
          fi

      - name: Get Commit Messages Since Last Release
        id: commit_messages
        run: |
          LAST_RELEASE_TAG=$(git describe --tags $(git rev-list --tags --max-count=1))
          COMMIT_MESSAGES=$(git log --pretty=format:"- %s" $LAST_RELEASE_TAG..HEAD --no-merges)
          echo "::set-output name=commit_messages::$COMMIT_MESSAGES"

      - name: Create GitHub Release
        if: steps.check_release.outputs.release_exists != 'true'
        uses: actions/create-release@v1
        with:
          tag_name: ${{ steps.versioning.outputs.updated_version }}
          release_name: Release ${{ steps.versioning.outputs.updated_version }}
          body: |
            Release ${{ steps.versioning.outputs.updated_version }}

            Changes since last release (commit messages):
            ${{ steps.commit_messages.outputs.commit_messages }}
        env:
          GITHUB_TOKEN: ${{ secrets.PAT }}

```

**Overview**:

**Trigger:** Il workflow viene attivato ad ogni pull request aperta verso il ramo principale, main.

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
- Crea la descrizio del rilascio: Reperisce tutti i messaggi di commit avvenuti tra la precedente versione e la creazione di quella corrente, per allegarli come descrizione del rilascio.
- Crea il rilascio GitHub: Crea un nuovo rilascio su GitHub se non esiste già per la versione aggiornata.


Questo workflow automatizza il versioning, i test e il processo di rilascio delle immagini Docker, garantendo rilasci consistenti e affidabili per il progetto.

**Main branch**:

- **coverage-main.yml**
```yml
name: Codecoverage

on:
  push:
    branches:
      - main

jobs:
  codecoverage:
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

      - name: Set up Docker Compose
        run: docker-compose up -d

      - name: Run tests and stop if they do not pass
        run: |
          ci_env=$(bash <(curl -s https://codecov.io/env))
          docker exec $ci_env mvp_python-api_1 pytest tests/test_algo.py --cov=. --cov-report=xml:/tests/coverage.xml --verbose
          docker exec $ci_env mvp_react-app_1 npm test
          docker exec $ci_env mvp_express_1 npm test
        continue-on-error: false

      - name: Copy coverage reports
        run: |
          docker cp mvp_python-api_1:/tests/coverage.xml ./coverage-python-api.xml
          docker cp mvp_react-app_1:/client/coverage/coverage-final.json ./coverage-react.json
          docker cp mvp_express_1:/express/coverage/coverage-final.json ./coverage-express.json

      - name: Stop and remove Docker containers
        run: docker-compose down

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
```
**Overview**:

**Trigger:** Il workflow viene attivato ad ogni push sul ramo principale, main.

**Steps:**
- Set Git user: Configura il nome e l'email dell'utente Git per le operazioni successive.
- Checkout repository: Ottiene una copia del repository.
- Set up Docker Buildx: Configura Docker Buildx, uno strumento per la compilazione di immagini Docker multi-architettura.
- Set up Docker Compose: Avvia i container Docker necessari per l'esecuzione dei test.
- Run tests and stop if they do not pass: Esegue i test per ciascun componente dell'applicazione (Python, React, Express) all'interno dei rispettivi container Docker. Se i test non superano, l'esecuzione del workflow si interrompe.
- Copy coverage reports: Copia i report di copertura generati all'interno dei container Docker nei file locali del repository.
- Stop and remove Docker containers: Interrompe e rimuove i container Docker utilizzati per l'esecuzione dei test.
- Upload Python API coverage report to Codecov: Carica il report di copertura del codice per l'API Python su Codecov, utilizzando il token di accesso fornito come variabile segreta nel repository.
- Upload React application coverage report to Codecov: Carica il report di copertura del codice per l'applicazione React su Codecov, utilizzando il token di accesso fornito come variabile segreta nel repository.
- Upload Express coverage report to Codecov: Carica il report di copertura del codice per l'applicazione Express su Codecov, utilizzando il token di accesso fornito come variabile segreta nel repository.

Includere la generazione di report anche per il branch principale (main) è fondamentale poiché fornisce un valore significativo. Ogni volta che viene aperta una pull request, Codecov potrà analizzare e confrontare le coperture del codice tra il branch in sviluppo e il branch principale. Questo fornisce dati preziosi che aiutano a valutare l'impatto delle modifiche proposte e a garantire che il codice integrato mantenga o migliori la copertura del codice già presente nel branch principale. Questo processo contribuisce a mantenere elevati standard di qualità del software e favorisce una migliore comprensione delle modifiche introdotte.

## Developers only

In questa sezione sono reperibili informazioni utili agli sviluppatori del software.

### Development process

**Sviluppo:**

Premessa: è di fondamentale importanza eseguire un pull dal repository remoto e un checkout sul branch develop prima di procedere con lo sviluppo:

Una volta all'interno del branch develop si potrà procedere con la modifica dei sorgenti. Ogni commit rappresenta uno step utile alla creazione di una nuova release.

**Versionamento:**

Premessa: se si vuole creare una nuova release e quindi modificare il numero di versione bisogna includere nel proprio messaggio di commit (l'ultimo prima di aver aperto la pull request) l'apposita sintassi:

- "... version-major" andrà a modificare il digit più significativo (es: v0.0.0 -> v.1.0.0);

- "... version-mid" andrà a modificare il digit di mezzo (es: v0.0.0 -> v.0.1.0);

- "... version-minor" andrà a modificare il digit meno significativo (es: v0.0.0 -> v.0.0.1);

Quando si vuole creare una nuova release basta aprire una pull request verso il branch main. Una volta terminati i check della action, la nuova release verrà creata in automatico.

**Esempio:**

Release attuale v1.0.0

Sviluppo:

Prima di tutto si fa un pull del repository remoto e ci si posiziona sul branch di sviluppo

```bash
git pull
git checkout develop
```

Modifica al codice/sorgenti 1 ...

```bash
git add .
git commit -m " Modificato ..."
git push
```

Modifica al codice/sorgenti 2 ...

```bash
git add .
git commit -m " Implementato ..."
```

Modifica al codice/sorgenti 3 ... (con l'intenzione poi di voler creare una nuova versione)

```bash
git add .
git commit -m " Corretto ... version-mid"
git push
```

Pull request:
Una volta aperta la pull request, la action incaricata eseguirà i vari check e procederà in caso di esito positivo, con la creazione della nuova release:

Release attuale v1.1.0 
Descrizione :
- " Modificato ..."
- " Implementanto ..."
- " Corretto ... version-mid"

### Local testing
Per eseguire i test localmente nelle propria macchina basta seguire le seguenti istruzioni:

Prima di tutto bisogna azionare il container Docker:
```bash
docker-compose up
```
E' possibile anche reperire l'ultima versione delle immagini dal repository del progetto, per velocizzare così il processo:
```bash
docker pull ghcr.io/farmacodeunipd/mvp/mvp_db:latest
docker pull ghcr.io/farmacodeunipd/mvp/mvp_python-api:latest
docker pull ghcr.io/farmacodeunipd/mvp/mvp_react-app:latest
docker pull ghcr.io/farmacodeunipd/mvp/mvp_express:latest
```
Una volta che il container e tutte le sue immagini hanno concluso il loro avvio, sarà possibili testare i vari servizi con i rispettivi comandi:

- Python-api (Algoritmo e relative API):
    ```bash
        docker exec mvp-python-api-1 pytest --verbose
    ``` 
- React-app (Client web):
    ```bash
        docker exec mvp-react-app-1 npm test
    ```
- Express (API per la connesione tra db e client):
    ```bash
        docker exec mvp-express-1 npm test
    ``` 

