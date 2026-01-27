1. `readConcern: snapshot` - czym te mongowe mechanizmy się różnią od MVCC/xmin/xmax w Postgresie?
2. Czy `readConcern` i `writeConcern` w mongo odpowiada bardziej różnym poziomom izolacji (jak w Postgresie) czy bardziej mechanizmowi quorum `R` i `W` w Distributed Replication? A może jest to kombinacja obu - albo jeszcze coś innego? Czy przychodzi Ci do głowy lepsza nazwa dla tego mechanizmu?
3. czy Covered Queries oraz SARGability to to samo? Czy Covered Queries sprowadza się do tego samego co Index Only Scan w postgresie?
4. Postgres ma te bloki po 8kb - jak przechowuje pliki Mongo?
5. Postgres ma mnóstwo różnych rodzajów indeksów (b-tree, GiST, GIN etc etc etc) - jak na tym tle wypada Mongo?
6. Mechanizm _copy on write_: jakie ma zastosowanie w Postgresie vs w Mongo? O co w nim chodzi?
7. Czy zasada ESR (determinująca kolejność elementów w indeksie mongo) ma zastosowanie także do postgresa?
8. `db.recent_requests.createIndex({ "status": 1 });` - tutaj 1/-1 określa kierunek (asc/desc) indeksu. Pytanie - po co to, skoro w postgresie się czegoś takiego z reguły nie określa? Skoro indeks używa podobnej struktury drzewiastej co w Postgresie (b-tree) - i można trawersować indeks zarówno od poczatku jak i od końca - to po co w ogóle jest to 1/-1 w API tworzenia indeksu?
9. czy mongo ma WAL albo jakiś jego ekwiwalent? Jeśli tak, czy jakościowo dorównuje postgresowemu WAL? Jeśli nie - na co ludzie narzekają?
10. Cokolwiek specyficznego / kluczowego jeśli chodzi o zarządzanie pamięcią RAM w przypadku kontenerów mongo? O czym SRE powinien wiedzieć?
