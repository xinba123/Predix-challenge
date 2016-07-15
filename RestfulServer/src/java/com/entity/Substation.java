/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.entity;

import java.io.Serializable;
import java.util.Collection;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

/**
 *
 * @author Jie Zhang
 */
@Entity
@Table(name = "SUBSTATION")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Substation.findAll", query = "SELECT s FROM Substation s"),
    @NamedQuery(name = "Substation.findBySubsid", query = "SELECT s FROM Substation s WHERE s.subsid = :subsid"),
    @NamedQuery(name = "Substation.findBySubsname", query = "SELECT s FROM Substation s WHERE s.subsname = :subsname"),
    @NamedQuery(name = "Substation.findBySubslong", query = "SELECT s FROM Substation s WHERE s.subslong = :subslong"),
    @NamedQuery(name = "Substation.findBySubslat", query = "SELECT s FROM Substation s WHERE s.subslat = :subslat")})
public class Substation implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Column(name = "SUBSID")
    private Integer subsid;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "SUBSNAME")
    private String subsname;
    @Basic(optional = false)
    @NotNull
    @Column(name = "SUBSLONG")
    private double subslong;
    @Basic(optional = false)
    @NotNull
    @Column(name = "SUBSLAT")
    private double subslat;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subsid")
    private Collection<Outage> outageCollection;

    public Substation() {
    }

    public Substation(Integer subsid) {
        this.subsid = subsid;
    }

    public Substation(Integer subsid, String subsname, double subslong, double subslat) {
        this.subsid = subsid;
        this.subsname = subsname;
        this.subslong = subslong;
        this.subslat = subslat;
    }

    public Integer getSubsid() {
        return subsid;
    }

    public void setSubsid(Integer subsid) {
        this.subsid = subsid;
    }

    public String getSubsname() {
        return subsname;
    }

    public void setSubsname(String subsname) {
        this.subsname = subsname;
    }

    public double getSubslong() {
        return subslong;
    }

    public void setSubslong(double subslong) {
        this.subslong = subslong;
    }

    public double getSubslat() {
        return subslat;
    }

    public void setSubslat(double subslat) {
        this.subslat = subslat;
    }

    @XmlTransient
    public Collection<Outage> getOutageCollection() {
        return outageCollection;
    }

    public void setOutageCollection(Collection<Outage> outageCollection) {
        this.outageCollection = outageCollection;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (subsid != null ? subsid.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Substation)) {
            return false;
        }
        Substation other = (Substation) object;
        if ((this.subsid == null && other.subsid != null) || (this.subsid != null && !this.subsid.equals(other.subsid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.entity.Substation[ subsid=" + subsid + " ]";
    }
    
}
