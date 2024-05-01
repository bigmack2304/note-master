import React from "react";
import { Link, Typography, Divider } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./AppInfo.scss";
import { APP_VERSION_MAJOR, APP_VERSION_MINOR, APP_VERSION_PATCH } from "5-app/settings";

/**
 * содержимое страницы "о приложении"
 */
function AppInfo() {
    return (
        <div className="AppInfo">
            <Typography component={"h2"} variant="h2" className="AppInfo__head">
                NoteMaser
                <Typography component={"span"} className="AppInfo__version">
                    v {APP_VERSION_MAJOR}.{APP_VERSION_MINOR}.{APP_VERSION_PATCH}
                </Typography>
            </Typography>
            <br />
            <br />
            <Typography component={"p"} variant="body1">
                Данное приложение разработано для создания заметок, либо просто текстовой информации (в дальнейшем файл).
            </Typography>
            <br />
            <Typography component={"p"} variant="body1">
                Каждому такому файлу можно присваивать теги, а сам файл можно поместить в определенную папку. Это сделано для того чтобы
                файлы можно было структурировать по содержимой информации и быстро их находить в случае необходимости.
            </Typography>
            <br />
            <Typography component={"p"} variant="body1">
                Файлы имеют ограничения по содержимому, так как приложение построено на основе web интерфейсов, которые в свою очередь
                предназначены для отображения информации. Из за этого добиться интерактивности с содержимым, такой как в word, excel, и
                подобных текстовых редакторов, будет проблематично. Поэтому на данный момент, полный контроль над содержимым не реализован.
            </Typography>
            <br />
            <Typography component={"p"} variant="body1">
                Но несмотря на это вам будут представлены различные компоненты которые можно добавлять в файл в неограниченном количестве,
                также вы сможете менять их позицию в файле и настраивать визуальное отображение и какие-то уникальные параметры.
            </Typography>
            <br />
            <Typography component={"p"} variant="body1">
                Возможно в будущем список компонентов будет пополнятся, но на данный момент он выглядит таким образом:
            </Typography>
            <ul className="AppInfo__components_list">
                <li>заголовок</li>
                <li>текст</li>
                <li>код</li>
                <li>список</li>
                <li>ссылка (на другую заметку или web ресурс)</li>
                <li>таблица</li>
                <li>изображение</li>
                <li>видео</li>
                <li>...</li>
            </ul>
            <br />
            <Typography component={"p"} variant="body1">
                В приложении используется технология PWA, это означает что открыв его в браузере, вы сможете установить его на свое
                устройство и пользоваться уже без интернета. Весь проект с файловой структурой хранится локально на устройстве и его можно
                скачать с приложения, например для того чтобы сделать резервную копию или открыть на другом устройстве. На данный момент
                технология синхронизации через интернет не реализована, но возможно такая возможность появится.
            </Typography>
            <br />
            <br />
            <Divider />
            <br />
            <div className="AppInfo__footer">
                <Link
                    href="https://github.com/bigmack2304/note-master"
                    className="AppInfo__link_to_git"
                    title="страница проекта на github"
                    target="_blank"
                >
                    <GitHubIcon></GitHubIcon>
                </Link>
            </div>
        </div>
    );
}

export { AppInfo };
