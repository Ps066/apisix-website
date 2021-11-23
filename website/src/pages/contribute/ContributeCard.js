import React, { useState, useEffect } from "react";
import styled from "styled-components";
import IconComment from "../../assets/icons/comment.svg";

const Card = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
  width: 80%;
  border: 1px solid rgb(232, 67, 62);
  border-radius: 5px;
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;

  &:hover {
    background-color: rgb(255,241,240,0.2);
    cursor: pointer;
    p{
      color: rgb(232, 67, 62);
    }
  }
  background-color: ${(props) => (props.isShow ? "rgb(255,241,240,0.2)" : "")};
`;

const ProjectTitle = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1.25 rem;
  margin-right: 1.25 rem;
`;
const Title = styled.p`
  margin: 0;
  font-size: 1.5rem;
  color: ${(props) => (props.isShow ? "rgb(232, 67, 62)" : "")};
`;

const Issue = styled.div`
  @media (max-width: 700px) {
    min-width: 5rem;
  }
  border: 1px solid rgb(232, 67, 62);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: .875rem;
`;

const ProjectDesc = styled.div`
  display: flex;
  color: ${(props) => (props.isShow ? "rgb(232, 67, 62)" : "")};
`;
const List = styled.div`
    display: ${(props) => (props.isShow ? "block" : "none")};
`;
const ListItem = styled.li`
  list-style: none;
  display: flex;
`;


const ContributeCard = (props) => {
  const { repoName } = props;
  const [isShow, setisShow] = useState(false);
  const [repoInfo, setRepoInfo] = useState({ description: '', Star: '', Watch: '', Fork: '' });
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    getGitHubIssuesInfo(repoName).then((result) => {
      setIssues(result);
    });
    getGitHubRepoInfo(repoName).then((result) => {
      setRepoInfo({ description: result.description, Star: result.stargazers_count, Watch: result.subscribers_count, Fork: result.forks_count })
    })
  }, []);
  return (
    <Card onClick={() => setisShow(!isShow)} isShow={isShow}>
      <ProjectTitle>
        <Title isShow={isShow}>{repoName}</Title>
        <Issue isShow={isShow}>{issues.length} issues</Issue>
      </ProjectTitle>
      <div>{repoInfo.description}</div>
      <ProjectDesc isShow={isShow}>
        <div style={{ marginRight: '1rem' }}>Star: {repoInfo.Star}</div>
        <div style={{ marginRight: '1rem' }}>Watch: {repoInfo.Watch}</div>
        <div style={{ marginRight: '1rem' }}>Fork: {repoInfo.Fork}</div>
      </ProjectDesc>
      <List isShow={isShow}>
        <ul style={{ paddingLeft: 0 }}>
          {issues.map(item => (
            <ListItem key={item.number}>
              <div style={{ minWidth: '4rem' }}>#{item.number}</div>
              <a target="_blank" href={item.html_url} style={{ flex: '1 1 auto', textDecoration: 'none', overflow: 'hidden' }}>{item.title} </a>
              {item.comments > 0 ? <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}><IconComment></IconComment><div style={{ marginLeft: '0.25rem', fontSize: '0.5rem', color: '#333' }}>{item.comments}</div></div> : ''}
            </ListItem>
          ))}
        </ul></List>
    </Card>
  );
};

const getGitHubIssuesInfo = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}/issues?state=open&labels=good%20first%20issue`, {
    headers: {
      "content-type": "application/json",
      Accept: "application / vnd.github.v3 + json",
    },
  }).then((response) => response.json()
  );
};

const getGitHubRepoInfo = (repo) => {
  return fetch(`https://api.github.com/repos/${repo}`, {
    headers: {
      "content-type": "application/json",
      Accept: "application / vnd.github.v3 + json",
    },
  }).then((response) => response.json());
};

export default ContributeCard;