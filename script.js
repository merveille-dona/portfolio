import themes from './theme.js';

function splitTheme(str) {
    return str.replace(/[:_-]/g, ' ').split(' ');
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        document.title = data.name ? data.name : "Cloud Developer Portfolio";

        // Theme
        const theme = splitTheme(data.theme) || ["blue", "dark"];
        const dark = localStorage.getItem("themeMode") || theme[0]
        const color = themes[theme[1]] ? theme[1] : "blue"
        const selectedTheme = themes[color][dark] || themes[blue['dark']];
        Object.entries(selectedTheme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
       
        // Basic Information
        document.getElementById("name").textContent = data.name;
        document.getElementById("title").textContent = data.title;
        document.getElementById("description").textContent = data.description;

        // Contact Links
        const contactLinks = document.getElementById("contact-links");
        contactLinks.innerHTML = ""; // Clear existing links

        Object.values(data.contact).forEach(contact => {
            if (contact.link) { // Ensure valid links
                const link = document.createElement("a");
                link.href = contact.link;
                link.textContent = contact.fieldName;
                link.target = "_blank";
                link.rel = "noopener noreferrer"; // Security for external links
                link.classList.add("contact-link");
                contactLinks.appendChild(link);
            }
        });
        
        if (data.allowToggleDarkMode) {
            const darkModeToggle = document.createElement("li");
            darkModeToggle.setAttribute("aria-label", "Toggle Dark Mode");
            darkModeToggle.classList.add("dark-mode-toggle");

            // SVG icon
            darkModeToggle.innerHTML = `
               <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m12 22c5.5228475 0 10-4.4771525 10-10s-4.4771525-10-10-10-10 4.4771525-10 10 4.4771525 10 10 10zm0-1.5v-17c4.6944204 0 8.5 3.80557963 8.5 8.5 0 4.6944204-3.8055796 8.5-8.5 8.5z" fill="currentColor"/></svg>
            `;

            // Add event listener space for future onclick function
            darkModeToggle.onclick = (e) => {
                e.preventDefault();
                console.log("Dark mode toggled");

                // Get current mode from local storage or default to "dark"
                const currentMode = localStorage.getItem("themeMode") || theme[0] || "dark";

                // Toggle mode
                const newMode = currentMode === "dark" ? "light" : "dark";

                // Apply new mode while keeping the current color
                const root = document.documentElement;
                const color = theme[1] || "blue"; // Default color if not set
                const newTheme = themes[color][newMode];

                Object.entries(newTheme).forEach(([property, value]) => {
                    root.style.setProperty(property, value);
                });
                // Store only the mode in local storage
                localStorage.setItem("themeMode", newMode);
            };
            contactLinks.appendChild(darkModeToggle);
        }

        // Skills Section
        const skillsSection = document.getElementById("skills");
        skillsSection.innerHTML = "<h3 class='skill-header'>Skills</h3>";

        const skillsContainerWrapper = document.createElement("div");
        skillsContainerWrapper.classList.add("skills-container-wrapper");

        data.skills.forEach(skill => {
            const skillDiv = document.createElement("div");
            skillDiv.classList.add("skill-container");

            const platformHeader = document.createElement("h4");
            platformHeader.classList.add("skill-platform");
            platformHeader.textContent = `${skill.platform}:`;

            const skillListItems = document.createElement("div");
            skillListItems.classList.add("skill-listitems");

            skill.list.forEach(skillItem => {
                const skillItemElement = document.createElement("p");
                skillItemElement.classList.add("skill-item");
                skillItemElement.textContent = skillItem;
                skillListItems.appendChild(skillItemElement);
            });

            skillDiv.appendChild(platformHeader);
            skillDiv.appendChild(skillListItems);
            skillsContainerWrapper.appendChild(skillDiv);
        });
        skillsSection.appendChild(skillsContainerWrapper);

        // Projects Section
        const projectsSection = document.getElementById("projects");
        if (data.projects && data.projects.length > 0) {
            projectsSection.innerHTML = "<h3 class='project-header'>Projects</h3>";
            const projectList = document.createElement("div");
            projectList.classList.add("project-list");
            data.projects.forEach(project => {
                const projectDiv = document.createElement("div");
                projectDiv.classList.add("project-container");

                // Project Image (if available)
                if (project.image) {
                    const projectImg = document.createElement("img");
                    projectImg.src = project.image;
                    projectImg.alt = `${project.name} preview`;
                    projectImg.classList.add("project-image");
                    projectDiv.appendChild(projectImg);
                }

                // Project Text
                const projectText = document.createElement("div");
                projectText.classList.add('project-text')

                // Project Title
                const projectTitle = document.createElement("h4");
                projectTitle.textContent = project.name;
                projectTitle.classList.add("project-name");
                projectText.appendChild(projectTitle);

                // Project Description
                const projectDesc = document.createElement("p");
                projectDesc.textContent = project.description;
                projectDesc.classList.add("project-description");
                projectText.appendChild(projectDesc);

                projectDiv.appendChild(projectText)

                // Project Links (if available)
                if (project.github || project.demo) {
                    const linksDiv = document.createElement("div");
                    linksDiv.classList.add("project-links");

                    if (project.github) {
                        const githubLink = document.createElement("a");
                        githubLink.href = project.github;
                        githubLink.textContent = "GitHub Repo";
                        githubLink.target = "_blank";
                        linksDiv.appendChild(githubLink);
                    }

                    if (project.demo) {
                        const demoLink = document.createElement("a");
                        demoLink.href = project.demo;
                        demoLink.textContent = "Live Demo";
                        demoLink.target = "_blank";
                        linksDiv.appendChild(demoLink);
                    }

                    projectDiv.appendChild(linksDiv);
                }

                projectList.appendChild(projectDiv);
            });
            projectsSection.appendChild(projectList);

        } else {
            projectsSection.style.display = "none";
        }

        // Certifications Section
        const certificationsSection = document.getElementById("certifications");
        if (data.certifications && data.certifications.length > 0) {
            certificationsSection.innerHTML = "<h3 class='cert-header'>Certifications</h3>";
            const certList = document.createElement("ul");
            certList.classList.add("certificationList");
            data.certifications.forEach(cert => {
                const certName = document.createElement("li");
                certName.classList.add("cert-item");
                certName.innerHTML = `<strong>${cert.name}</strong> - ${cert.provider}`;
                certList.appendChild(certName);
            });
            certificationsSection.appendChild(certList);
        } else {
            certificationsSection.style.display = "none";
        }

        // Articles Section
        const articlesSection = document.getElementById("articles");

        if (data.articles && data.articles.items && data.articles.items.length > 0) {
            articlesSection.innerHTML = "<h3 class='articles-header'>Articles</h3> <p class='article-subheader'>" + data.articles.header + "</p>";

            const articleList = document.createElement("ul");
            articleList.classList.add("article-list");

            data.articles.items.forEach(article => {
                const articleItem = document.createElement("li");
                articleItem.classList.add("article-item");

                const articleLink = document.createElement("a");
                articleLink.classList.add("article-link");
                articleLink.href = article.url;
                articleLink.textContent = article.title;
                articleLink.target = "_blank";

                if (article.cover) {
                    const articleImage = document.createElement("img");
                    articleImage.src = article.cover;
                    articleImage.alt = article.title;
                    articleImage.classList.add("article-cover");
                    articleItem.appendChild(articleImage);
                }
                articleItem.appendChild(articleLink);
                articleList.appendChild(articleItem);
            });

            articlesSection.appendChild(articleList);
        } else {
            articlesSection.style.display = "none";
        }

    } catch (error) {
        console.error("Error loading data.json:", error);
    }
});
