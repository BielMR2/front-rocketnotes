import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Header } from "../../components/Header"
import { Input } from "../../components/Input"
import { Textarea } from "../../components/Textarea"
import { NoteItem } from "../../components/NoteItem"
import { Section } from "../../components/Section"
import { Button } from "../../components/Button"
import { ButtonText } from "../../components/ButtonText"

import { api } from '../../services/api'

import { Container, Form } from "./styles"

export function New(){
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const [links, setLinks] = useState([])
    const [newLink, setNewLink] = useState("")

    const [tags, setTags] = useState([])
    const [newTag, setNewTag] = useState("")

    const navigate = useNavigate()

    function handleBack() {
        navigate(-1)
      }

    function handleAddLink(){
        setLinks(prevState => [...prevState, newLink])
        setNewLink("")
    }

    function handleRemoveLink(deleted){
        setLinks(prevState => prevState.filter(link => link !== deleted))
    }

    function handleAddTag(){
        setTags(prevState => [...prevState, newTag])
        setNewTag("")
    }

    function handleRemoveTag(deleted){
        setTags(prevState => prevState.filter(tag => tag !== deleted))
    }

    async function handleNewNote(){
        if(!title){
            return alert("Digite o título da nota")
        }
        if(newLink){
            alert("Você deixou um link no campo para adicionar, mas nao clicou em adicinar. CLique para adicionar ou deixe o campo vazio")
        }
        if(newTag){
            alert("Você deixou uma tag no campo para adicionar, mas nao clicou em adicinar. CLique para adicionar ou deixe o campo vazio")
        }
        
        await api.post("/notes", {
            title,
            description,
            tags,
            links
        })

        .then(() => {
            alert("Nota criada com sucesso!")
            navigate(-1)
        })
        .catch(error => {
            if(error.response){
            alert(error.response.data.message)
            } else {
                alert("Não foi possivel cadastrar")
            }
        }) 

    }


    return(
        <Container>
            <Header />

            <main>
                <Form>
                    <header>
                        <h1>Criar nota</h1>
                        <ButtonText 
                            title="Voltar" 
                            onClick={handleBack} 
                        />
                    </header>

                    <Input 
                        placeholder="Título" 
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Textarea 
                        placeholder="Obseravações" 
                        onChange={e => setDescription(e.target.value)}
                    />
                    
                    <Section title="Links úteis">
                        {
                            links.map((link, index) => (
                                <NoteItem
                                    key={String(index)} 
                                    value={link}
                                    onClick={() => handleRemoveLink(link)} 
                                />
                            ))
                        }


                        <NoteItem 
                            isNew 
                            placeholder="Novo link"
                            value={newLink}
                            onChange={e => setNewLink(e.target.value)}
                            onClick={handleAddLink}
                            onKeyPress={e => e.key == "Enter" && handleAddLink()} 
                        />

                    </Section>
                                

                    <Section title="Marcadores">
                        <div className="tags">
                            {
                                tags.map((tag, index) => (
                                    <NoteItem 
                                        key={String(index)}
                                        value={tag} 
                                        onClick={() => handleRemoveTag(tag)}    
                                    />
                                ))
                            }

                            <NoteItem 
                                isNew 
                                placeholder="Nova tag"
                                value={newTag}
                                onChange={e => setNewTag(e.target.value)}
                                onClick={handleAddTag}
                                onKeyPress={e => e.key == "Enter" && handleAddTag()}
                            />
                        </div>
                    </Section>

                    <Button 
                        title="Salvar" 
                        onClick={handleNewNote}
                    />
                </Form>
            </main>
        </Container>
        
    )
}